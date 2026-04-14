import { Show } from "./types";

export function getMovieMetadata() {
  return {
    subtitle: "Now Showing",
    description: "Cinematic Experience",
    rating: "4.5/5",
    duration: "120 mins",
    color: "from-zinc-500 to-zinc-900",
  };
}

export function enrichShow(show: Show) {
  return {
    ...show,
    ...getMovieMetadata(),
  };
}
