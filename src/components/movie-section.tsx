import { useRef } from "react";
import { MovieCard } from "./movie-card";
import type { Movie } from "@/types";

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  onMovieClick?: (movie: Movie) => void;
  showBadge?: boolean;
  badgeText?: string;
  badgeColor?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export const MovieSection = ({
  title,
  movies,
  isLoading,
  onMovieClick,
  showBadge = false,
  badgeText = "HOT",
  badgeColor = "bg-gradient-to-r from-red-500 to-orange-500",
  showViewAll = true,
  onViewAll,
}: MovieSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
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
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
          <div className="h-6 bg-gray-600 rounded w-20 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[2/3] bg-gray-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  // Show message when no movies
  if (!movies || movies.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
            {showBadge && (
              <span
                className={`${badgeColor} text-white px-3 py-1 rounded-full text-xs font-bold mr-3 animate-pulse`}
              >
                {badgeText}
              </span>
            )}
            {title}
          </h2>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-lg">Đang tải dữ liệu phim...</p>
          <p className="text-gray-500 text-sm mt-2">
            Vui lòng kiểm tra kết nối mạng
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
          {showBadge && (
            <span
              className={`${badgeColor} text-white px-3 py-1 rounded-full text-xs font-bold mr-3 animate-pulse`}
            >
              {badgeText}
            </span>
          )}
          {title}
        </h2>
        {showViewAll && (
          <button
            onClick={onViewAll}
            className="text-green-500 hover:text-green-400 transition-colors text-sm font-medium flex items-center"
          >
            Xem thêm
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Movies Grid */}
      <div className="relative group">
        {/* Scroll Left Button */}
        {movies.length > 6 && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Scroll Right Button */}
        {movies.length > 6 && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Movies Horizontal Scroll */}
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none" }}
        >
          {movies && movies.length > 0 ? (
            movies.map((movie, index) => (
              <div
                key={movie._id}
                className="flex-shrink-0 w-48 sm:w-52 relative"
              >
                {/* Ranking number for top 10 */}
                {index < 10 && (
                  <div className="absolute -top-2 -left-2 z-20 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                )}
                <MovieCard
                  movie={movie}
                  onClick={() => onMovieClick?.(movie)}
                />
              </div>
            ))
          ) : (
            <div className="w-full flex items-center justify-center py-12">
              <div className="text-gray-400 text-center">
                <div className="text-2xl mb-2">🎬</div>
                <p>Không có phim nào trong danh mục này</p>
                <p className="text-sm opacity-70">Vui lòng thử lại sau</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
