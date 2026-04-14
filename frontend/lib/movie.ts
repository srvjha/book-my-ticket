import { Show } from "./types";

export interface MovieMetadata {
  subtitle: string;
  description: string;
  poster: string;
  rating: string;
  duration: string;
  color: string;
}

export type MovieWithMetadata = Show & MovieMetadata;

export const DEFAULT_POSTERS = [
  "https://images.unsplash.com/photo-1614728263952-84ea206f0c4c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542204172-3c1f81078699?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=2056&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop",
];

export const SAMPLE_METADATA_MAP: Record<string, Partial<MovieMetadata>> = {
  "Dhurandhar": {
    subtitle: "The Revenge",
    description: "Experience the most awaited action thriller of 2026. A story of betrayal, redemption, and the ultimate sacrifice.",
    poster: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/dhurandhar-the-revenge-et00478890-1772893614.jpg",
    rating: "4.9/5",
    duration: "165 mins",
    color: "from-emerald-500 to-zinc-900"
  },
  "Project Phoenix": {
    subtitle: "Rise from Ashes",
    description: "A groundbreaking sci-fi masterpiece exploring the depths of artificial consciousness.",
    poster: "https://images.unsplash.com/photo-1614728263952-84ea206f0c4c?q=80&w=2070&auto=format&fit=crop",
    rating: "4.7/5",
    duration: "142 mins",
    color: "from-blue-500 to-zinc-900"
  }
};

export function getMovieMetadata(movieName: string, index: number): MovieMetadata {
  const meta = SAMPLE_METADATA_MAP[movieName] || {
    subtitle: "Now Showing",
    description: "Experience this cinematic masterpiece on the big screen. Book your tickets now for an unforgettable experience.",
    poster: DEFAULT_POSTERS[index % DEFAULT_POSTERS.length],
    rating: "4.5/5",
    duration: "120 mins",
    color: "from-zinc-500 to-zinc-900"
  };

  return {
    subtitle: meta.subtitle || "Now Showing",
    description: meta.description || "Cinematic Experience",
    poster: meta.poster || DEFAULT_POSTERS[index % DEFAULT_POSTERS.length],
    rating: meta.rating || "4.5/5",
    duration: meta.duration || "120 mins",
    color: meta.color || "from-zinc-500 to-zinc-900"
  };
}

export function enrichShow(show: Show, index: number): MovieWithMetadata {
  return {
    ...show,
    ...getMovieMetadata(show.movie_name, index)
  };
}
