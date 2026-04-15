"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { checkAuth, getSeats, bookSeats } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import useSWR from "swr";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface Seat {
  id: number;
  is_booked?: boolean;
  isbooked?: boolean;
  booked_by_username?: string;
}

function BookingContent() {
  const searchParams = useSearchParams();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Get movie details from URL
  const showId = searchParams.get("id");
  const movieTitle = searchParams.get("title") || "Dhurandhar: The Revenge";
  const movieSubtitle = searchParams.get("subtitle") || "";
  const moviePoster =
    searchParams.get("poster") ||
    "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/dhurandhar-the-revenge-et00478890-1772893614.jpg";

  const { data: userData, isLoading } = useSWR("/api/v1/auth/me", checkAuth);

  const loadSeats = useCallback(async () => {
    if (!showId) return;
    try {
      const result = await getSeats(showId);
      if (result.success) {
        setSeats(result.data.sort((a: Seat, b: Seat) => a.id - b.id));
      }
    } catch (err) {
      console.error("Failed to load seats", err);
    } finally {
      setLoading(false);
    }
  }, [showId]);

  const myBookedSeats = seats.filter(
    (s) => (s.is_booked || s.isbooked) && s.booked_by_username === userData?.username
  );

  useEffect(() => {
    loadSeats();
  }, [loadSeats]);

  const toggleSeat = (id: number) => {
    setSelectedSeats((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleCheckout = () => {
    if (selectedSeats.length === 0 || !showId) return;
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0 || !showId) return;
    setBookingInProgress(true);

    try {
      const result = await bookSeats(selectedSeats, userData.username, showId);
      if (result.success) {
        toast.success(`Successfully booked ${selectedSeats.length} seats!`);
        setSelectedSeats([]);
        setShowConfirmation(false);
        await loadSeats();
      } else {
        toast.error(result.message || "Booking failed.");
        setShowConfirmation(false);
      }
    } catch (err: any) {
      console.error("Booking error", err);
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
      setShowConfirmation(false);
    } finally {
      setBookingInProgress(false);
    }
  };

  const handleCancelBooking = () => {
    setShowConfirmation(false);
    setBookingInProgress(false);
    toast.error("Booking confirmation cancelled.");
  };

  if (isLoading || !userData || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Sidebar Info */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8"
      >
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-xl aspect-2/3 max-w-50 mx-auto lg:mx-0">
          <Image
            width={200}
            height={300}
            loading="eager"
            src={moviePoster}
            className="w-full h-full object-cover"
            alt="Poster"
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight leading-tight">
            {movieTitle}
          </h2>
          {movieSubtitle && (
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
              {movieSubtitle}
            </p>
          )}
          <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 pt-2">
            <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded">
              A1
            </span>
            <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded">
              IMAX
            </span>
            <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded">
              2D
            </span>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800 space-y-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500 font-medium">Selected Seats</span>
            <span className="font-bold text-emerald-500">
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500 font-medium">Total Price</span>
            <span className="text-xl font-black">
              ${selectedSeats.length * 150}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckout}
            disabled={selectedSeats.length === 0 || bookingInProgress || showConfirmation}
            className="w-full bg-emerald-500 text-black font-black py-4 rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:grayscale"
          >
            {bookingInProgress ? "Processing..." : "Checkout Now"}
          </motion.button>
        </div>
      </motion.div>

      {/* Theater Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="lg:col-span-2 bg-zinc-900/30 rounded-3xl border border-zinc-800 p-8 md:p-12 relative overflow-hidden h-fit"
      >
        {/* Screen Arc */}
        <div className="max-w-100 mx-auto mb-16 relative">
          <div className="w-full h-1 bg-emerald-500 rounded-full shadow-[0_4px_24px_rgba(16,185,129,0.5)]"></div>
          <div className="text-center text-[10px] uppercase tracking-[0.4em] font-black text-zinc-600 mt-4">
            Cinema Screen
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-8 gap-4 min-w-[320px] max-w-fit mx-auto">
            {seats.map((seat) => {
              const isBooked = seat.is_booked || seat.isbooked;
              const isSelected = selectedSeats.includes(seat.id);

              return (
                <button
                  key={seat.id}
                  disabled={isBooked}
                  onClick={() => toggleSeat(seat.id)}
                  className={cn(
                    "w-10 h-10 aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all",
                    isBooked
                      ? "bg-zinc-950 border border-zinc-800 text-zinc-800 cursor-not-allowed"
                      : isSelected
                        ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)] scale-110 z-10"
                        : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300",
                  )}
                >
                  {seat.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center flex-wrap gap-8 mt-12 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-zinc-800 rounded-sm"></div> Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-zinc-950 border border-zinc-800 rounded-sm"></div>{" "}
            Booked
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm shadow-sm shadow-emerald-500/50"></div>{" "}
            Selected
          </div>
        </div>

        {/* My Booked Seats List */}
        {myBookedSeats.length > 0 && (
          <div className="mt-12 pt-8 border-t border-zinc-800/50">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">
              Your Booked Seats
            </h3>
            <div className="flex flex-wrap gap-2">
              {myBookedSeats.map((s) => (
                <div
                  key={s.id}
                  className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 text-[10px] font-black"
                >
                  SEAT {s.id}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        title="Confirm Booking"
        description="Please review your booking details before confirming. This confirmation will expire in 1 minute."
        selectedSeats={selectedSeats}
        totalPrice={selectedSeats.length * 150}
        timeoutDuration={60}
        onConfirm={handleConfirmBooking}
        onCancel={handleCancelBooking}
        isLoading={bookingInProgress}
      />
    </main>
  );
}

export default function Booking() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
