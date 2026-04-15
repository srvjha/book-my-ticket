"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  selectedSeats: number[];
  totalPrice: number;
  timeoutDuration?: number; // in seconds, default 60
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  title,
  description,
  selectedSeats,
  totalPrice,
  timeoutDuration = 60,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmationDialogProps) {
  const [timeLeft, setTimeLeft] = useState(timeoutDuration);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(timeoutDuration);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onCancel(); // Auto-cancel when timer reaches 0
          return timeoutDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, timeoutDuration, onCancel]);

  const progressPercentage = (timeLeft / timeoutDuration) * 100;
  const isWarning = timeLeft <= 10;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="text-lg font-black">{title}</h2>
                <button
                  onClick={onCancel}
                  disabled={isLoading}
                  className="text-zinc-500 hover:text-zinc-300 disabled:opacity-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6 space-y-4">
                {description && (
                  <p className="text-sm text-zinc-400">{description}</p>
                )}

                {/* Seats Preview */}
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Seats Selected</span>
                    <span className="font-bold text-emerald-400">
                      {selectedSeats.join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-3 border-t border-zinc-700">
                    <span className="text-zinc-400">Total Amount</span>
                    <span className="text-2xl font-black text-emerald-500">
                      ${totalPrice}
                    </span>
                  </div>
                </div>

                {/* Timer */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className={isWarning ? "text-red-400 font-bold" : "text-zinc-400"}>
                      {isWarning ? "⏱️ Confirmation expires in" : "Auto-cancel in"}
                    </span>
                    <span
                      className={`font-bold text-sm ${
                        isWarning ? "text-red-400" : "text-emerald-400"
                      }`}
                    >
                      {timeLeft}s
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full transition-colors ${
                        isWarning ? "bg-red-500" : "bg-emerald-500"
                      }`}
                      initial={{ width: "100%" }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer - Actions */}
              <div className="px-6 py-4 bg-zinc-800/30 border-t border-zinc-800 flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Booking...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
