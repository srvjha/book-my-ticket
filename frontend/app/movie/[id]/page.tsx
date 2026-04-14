"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import { checkAuth, getShow } from "@/lib/api";
import useSWR from "swr";
import { enrichShow } from "@/lib/movie";
import Image from "next/image";

interface MovieDetailProps {
  params: Promise<{ id: string }>;
}

export default function MovieDetail({ params }: MovieDetailProps) {
  const router = useRouter();
  const { id } = use(params);
  const [bookingLoading, setBookingLoading] = useState(false);

  const { data, isLoading, error } = useSWR(`/api/shows/${id}`, () =>
    getShow(id),
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-bold animate-pulse text-sm uppercase tracking-widest">
          Loading Details...
        </p>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <h2 className="text-3xl font-black text-zinc-500">Show Not Found</h2>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors"
        >
          Return to Movies
        </button>
      </div>
    );
  }

  const movie = enrichShow(data.data);

  const handleBooking = async () => {
    setBookingLoading(true);
    const user = await checkAuth();
    const bookingUrl = `/booking?id=${id}&title=${encodeURIComponent(movie.movie_name)}&subtitle=${encodeURIComponent(movie.subtitle)}&poster=${encodeURIComponent(movie.banner_url)}`;
    if (!user) {
      router.push(`/signin?redirect=${encodeURIComponent(bookingUrl)}`);
    } else {
      router.push(bookingUrl);
    }
    setBookingLoading(false);
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto px-6 py-12 flex flex-col min-h-[calc(100vh-80px)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-1"
      >
        <div className="space-y-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to movies
          </button>

          <div className="space-y-4">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-widest rounded-full border border-emerald-500/20"
            >
              Now Showing
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-black leading-tight tracking-tighter"
            >
              {movie.movie_name}
              <br />
              <span className="text-zinc-500">{movie.subtitle}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-zinc-400 text-lg leading-relaxed max-w-lg"
            >
              {movie.description}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center gap-8 text-sm text-zinc-500 font-medium"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />{" "}
              {new Date(movie.start_time).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> {movie.duration}
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />{" "}
              {movie.rating}
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBooking}
            disabled={bookingLoading}
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center gap-2">
              {bookingLoading ? "Checking..." : "Book Your Seats"}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group"
        >
          <div
            className={`absolute -inset-1 bg-gradient-to-r ${movie.color} rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`}
          ></div>
          <div className="relative bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
            <Image
              width={500}
              height={500}
              loading="eager"
              src={movie.banner_url}
              className="w-full aspect-[4/5] object-cover opacity-80"
              alt={movie.movie_name}
            />
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
