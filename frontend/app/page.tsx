"use client";
import { Star, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getShows } from "@/lib/api";
import useSWR from "swr";
import { Show } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { data, isLoading } = useSWR("/api/shows", getShows);

  const movies: Show[] = data?.data || [];
  const sampleData = {
    duration: "2h 30m",
    rating: "8.5/10",
    subtitle: "Action, Adventure",
    color: "bg-gradient-to-r from-red-500 to-pink-500",
    description: "A thrilling adventure movie",
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-bold animate-pulse text-sm uppercase tracking-widest">
          Discovering Movies...
        </p>
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto px-6 py-12 flex flex-col min-h-[calc(100vh-80px)]">
      <AnimatePresence mode="wait">
        <motion.div
          key="list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black tracking-tighter"
            >
              Featured <span className="text-zinc-500">Movies</span>
            </motion.h1>
            <p className="text-zinc-400 max-w-xl text-lg">
              Discover the latest blockbusters and cinematic experiences curated
              for you.
            </p>
          </div>

          {movies.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-zinc-800 rounded-3xl">
              <p className="text-zinc-500 font-medium">
                No movies found in the database.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {movies.map((movie, index) => (
                <Link key={movie.id} href={`/movie/${movie.id}`}>
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 mb-4 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                      <Image
                        width={500}
                        height={500}
                        loading="eager"
                        src={movie.banner_url}
                        alt={movie.movie_name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                        <div className="flex items-center gap-2 text-white font-bold">
                          <PlayCircle className="w-8 h-8 text-emerald-500" />
                          <span>View Details</span>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1 text-xs font-bold text-white">
                        <Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                        {sampleData.rating.split("/")[0]}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-emerald-500 transition-colors uppercase tracking-tight">
                      {movie.movie_name}
                    </h3>
                    <p className="text-zinc-500 text-sm font-medium">
                      {sampleData.subtitle}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
