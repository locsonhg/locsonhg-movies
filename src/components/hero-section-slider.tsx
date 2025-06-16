import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import type { Movie } from "@/types";

interface HeroSectionProps {
  featuredMovies: Movie[];
  isLoading?: boolean;
}

export const HeroSection = ({
  featuredMovies,
  isLoading = false,
}: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (featuredMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (isLoading || featuredMovies.length === 0) {
    return (
      <div className="relative h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-white text-xl font-medium">
              Đang tải phim hot...
            </div>
            <div className="text-gray-400 text-sm mt-2">
              Chuẩn bị nội dung tuyệt vời cho bạn
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentMovie = featuredMovies[currentSlide];

  return (
    <div className="relative h-screen overflow-hidden bg-black group">
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        <img
          src={currentMovie.poster_url || currentMovie.thumb_url}
          alt={currentMovie.name}
          className="w-full h-full object-cover scale-110"
        />
        {/* Gradient overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="mx-auto px-2.5 lg:px-14 w-full">
          <div className="max-w-2xl">
            {/* Category and Year */}
            <div className="flex items-center space-x-3 mb-3">
              {currentMovie.category?.slice(0, 3).map((cat, index) => (
                <span
                  key={cat._id}
                  className="text-gray-300 text-sm font-medium"
                >
                  {cat.name}
                  {index < 2 &&
                    index < (currentMovie.category?.length || 0) - 1 &&
                    " • "}
                </span>
              )) || []}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight">
              {currentMovie.name}
            </h1>

            {/* Subtitle */}
            {currentMovie.origin_name &&
              currentMovie.origin_name !== currentMovie.name && (
                <p className="text-lg md:text-xl text-gray-200 mb-4 font-medium">
                  {currentMovie.origin_name}
                </p>
              )}

            {/* Movie Info */}
            <div className="flex items-center space-x-4 mb-6 text-sm">
              {currentMovie.year && (
                <span className="text-green-400 font-semibold">
                  {currentMovie.year}
                </span>
              )}
              {currentMovie.quality && (
                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded border border-green-500/30">
                  {currentMovie.quality}
                </span>
              )}
              {currentMovie.episode_current && (
                <span className="text-gray-300">
                  {currentMovie.episode_current}
                </span>
              )}
              {currentMovie.lang && (
                <span className="text-gray-300">{currentMovie.lang}</span>
              )}
              {currentMovie.view && (
                <span className="text-gray-300 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {currentMovie.view.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-200 text-base leading-relaxed mb-8 line-clamp-3 max-w-xl">
              {currentMovie.content
                ? currentMovie.content.replace(/<[^>]*>/g, "").slice(0, 150) +
                  "..."
                : "Một bộ phim hấp dẫn với cốt truyện ly kỳ, diễn xuất tuyệt vời và hình ảnh đẹp mắt."}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button
                variant="primary"
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-base font-semibold transition-all hover:scale-105"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Phát ngay
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 px-6 py-3 text-base font-medium transition-all"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Chi tiết
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() =>
          setCurrentSlide(
            (prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length
          )
        }
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <svg
          className="w-6 h-6 transform rotate-180"
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

      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev + 1) % featuredMovies.length)
        }
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <svg
          className="w-6 h-6"
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

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div
          className="h-full bg-green-500 transition-all duration-300"
          style={{
            width: `${((currentSlide + 1) / featuredMovies.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
