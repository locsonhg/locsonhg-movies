import { useRef } from "react";
import { MovieCard } from "./movie-card";
import type { Movie } from "@/types";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  onMovieClick?: (movie: Movie) => void;
  showBadge?: boolean;
  badgeText?: string;
}

export const MovieRow = ({
  title,
  movies,
  isLoading,
  onMovieClick,
  showBadge = false,
  badgeText = "TOP 10",
}: MovieRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of card + gap
      const newScrollPosition =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
          <div className="h-6 bg-gray-300 rounded w-16 animate-pulse"></div>
        </div>
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="min-w-[200px] h-[300px] bg-gray-300 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <button className="text-green-400 hover:text-green-300 font-medium text-sm flex items-center">
          Xem tất cả
          <span className="ml-1">→</span>
        </button>
      </div>

      {/* Movies Container */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center -ml-6"
        >
          ←
        </button>

        {/* Movies Scroll Container */}
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie, index) => (
            <div key={movie._id} className="relative min-w-[200px] group/card">
              {/* TOP Badge */}
              {showBadge && index < 10 && (
                <div className="absolute top-2 left-2 z-10">
                  <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                    {badgeText}
                  </div>
                </div>
              )}

              {/* Ranking Number for TOP items */}
              {showBadge && index < 3 && (
                <div className="absolute top-2 right-2 z-10">
                  <div className="w-8 h-8 bg-yellow-500 text-black rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
              )}

              <div className="transform transition-transform duration-300 group-hover/card:scale-105">
                <MovieCard movie={movie} onClick={onMovieClick} />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300 rounded-lg opacity-0 group-hover/card:opacity-100 flex items-center justify-center">
                <button
                  onClick={() => onMovieClick?.(movie)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform translate-y-4 group-hover/card:translate-y-0"
                >
                  ▶ Xem ngay
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center -mr-6"
        >
          →
        </button>
      </div>
    </div>
  );
};
