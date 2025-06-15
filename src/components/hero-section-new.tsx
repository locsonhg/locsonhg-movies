import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import type { Movie } from "@/types";

// Extended movie type for featured movies with detail data
interface EnhancedMovie extends Movie {
  overview?: string;
  backdrop_path?: string;
  genres?: { name: string }[];
  vote_average?: number;
  isDetailLoaded?: boolean;
  isDetailLoading?: boolean;
  episodes?: any[];
}

interface HeroSectionProps {
  featuredMovies: EnhancedMovie[];
  isLoading?: boolean;
  onMovieClick?: (movie: Movie) => void;
}

export const HeroSection = ({
  featuredMovies,
  isLoading = false,
  onMovieClick,
}: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Helper function to get full image URL
  const getImageUrl = (url: string | undefined) => {
    if (!url)
      return "https://via.placeholder.com/1920x1080/1f2937/ffffff?text=No+Image";
    if (url.startsWith("http")) return url;
    return `https://phimimg.com/${url}`;
  };

  const currentMovie = featuredMovies[currentSlide];

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

  return (
    <div className="relative h-[60vh] sm:h-screen overflow-hidden bg-black group">
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(currentMovie?.poster_url || currentMovie?.thumb_url)}
          alt={currentMovie?.name}
          className="w-full h-full object-cover scale-110"
        />
        {/* Gradient overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container px-4 sm:px-6 lg:px-14">
          <div className="max-w-3xl">
            {/* Tags and Labels */}
            <div className="flex items-center flex-wrap gap-2 mb-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                HOT
              </span>
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                TOP 10
              </span>
              {currentMovie.category?.slice(0, 2).map((cat) => (
                <span
                  key={cat.id}
                  className="bg-white/20 text-white px-2 py-1 rounded text-xs font-medium"
                >
                  {cat.name}
                </span>
              )) || []}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3 leading-tight break-words">
              {currentMovie.name}
            </h1>

            {/* Subtitle */}
            {currentMovie.origin_name &&
              currentMovie.origin_name !== currentMovie.name && (
                <p className="hidden sm:block text-lg md:text-xl text-gray-200 mb-4 font-medium">
                  {currentMovie.origin_name}
                </p>
              )}

            {/* Movie Info */}
            <div className="flex items-center flex-wrap gap-2 sm:gap-3 mb-4 text-xs sm:text-sm">
              <span className="flex items-center bg-yellow-500 px-2 sm:px-3 py-1 rounded text-black font-bold">
                ★ {(currentMovie.vote_average || 7.5).toFixed(1)}
              </span>
              <span className="text-white font-medium bg-black/40 px-2 sm:px-3 py-1 rounded">
                {currentMovie.year}
              </span>
              <span className="bg-green-600 px-2 sm:px-3 py-1 rounded text-white text-xs font-bold uppercase">
                {currentMovie.quality || "HD"}
              </span>
              <span className="hidden sm:inline text-gray-200 bg-black/40 px-3 py-1 rounded">
                {currentMovie.episode_current || "Hoàn Tất"}
              </span>
              <span className="hidden sm:inline text-gray-200 bg-black/40 px-3 py-1 rounded">
                {currentMovie.lang || "Vietsub"}
              </span>
              {currentMovie.isDetailLoading && (
                <span className="text-gray-400 text-xs">
                  Đang tải thông tin...
                </span>
              )}
            </div>

            {/* Country and Additional Info */}
            <div className="flex items-center flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6 text-xs sm:text-sm">
              {currentMovie.country && currentMovie.country.length > 0 && (
                <span className="text-gray-300 flex items-center">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {currentMovie.country[0]?.name}
                </span>
              )}
              <span className="hidden sm:flex text-gray-300 items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                Cập nhật:{" "}
                {new Date(
                  currentMovie.modified?.time || Date.now()
                ).toLocaleDateString("vi-VN")}
              </span>
              <span className="text-gray-300 flex items-center">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                <span className="hidden sm:inline">
                  {currentMovie.lang || "Vietsub + Thuyết minh"}
                </span>
                <span className="sm:hidden">VietSub</span>
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-4 sm:mb-8 line-clamp-2 sm:line-clamp-3 max-w-xl break-words">
              {currentMovie.overview ||
                (currentMovie.content
                  ? currentMovie.content.replace(/<[^>]*>/g, "").slice(0, 150) +
                    "..."
                  : `Phim ${currentMovie.name} thuộc thể loại ${
                      currentMovie.category?.map((c) => c.name).join(", ") ||
                      "Drama"
                    }, được sản xuất năm ${
                      currentMovie.year
                    }. Phim có chất lượng ${currentMovie.quality} với ${
                      currentMovie.lang
                    }.`)}
            </p>

            {/* Cast and Director Info - Show if detail is loaded */}
            {currentMovie.isDetailLoaded &&
              (currentMovie.actor?.length > 0 ||
                currentMovie.director?.length > 0) && (
                <div className="hidden sm:block space-y-2 mb-6 text-sm">
                  {currentMovie.director?.length > 0 && (
                    <div className="text-gray-300">
                      <span className="text-gray-400">Đạo diễn:</span>{" "}
                      {currentMovie.director.slice(0, 2).join(", ")}
                    </div>
                  )}
                  {currentMovie.actor?.length > 0 && (
                    <div className="text-gray-300">
                      <span className="text-gray-400">Diễn viên:</span>{" "}
                      {currentMovie.actor.slice(0, 3).join(", ")}
                      {currentMovie.actor.length > 3 && "..."}
                    </div>
                  )}
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4 mb-4 sm:mb-6">
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-black px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg font-bold rounded-lg transition-all duration-200 flex items-center shadow-lg"
                onClick={() => onMovieClick?.(currentMovie)}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden sm:inline">Phát ngay</span>
                <span className="sm:hidden">Phát</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="hidden sm:flex border-white/30 text-white hover:bg-white/10 px-6 py-3 text-lg rounded-lg transition-all duration-200 items-center"
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Yêu thích
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="hidden sm:flex border-white/30 text-white hover:bg-white/10 px-4 py-3 text-lg rounded-lg transition-all duration-200 items-center"
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
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                Chia sẻ
              </Button>
            </div>

            {/* Additional Info - Cast/Director (if available) */}
          </div>
        </div>
      </div>

      {/* Slide Navigation Dots */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-3">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide ? "scale-110" : "hover:scale-105"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-green-500"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() =>
          setCurrentSlide((prev) =>
            prev === 0 ? featuredMovies.length - 1 : prev - 1
          )
        }
        className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev + 1) % featuredMovies.length)
        }
        className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
          style={{
            width: `${((currentSlide + 1) / featuredMovies.length) * 100}%`,
          }}
        />
      </div>

      {/* Movie Count Indicator */}
      <div className="absolute top-24 right-6 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
        {currentSlide + 1} / {featuredMovies.length}
      </div>
    </div>
  );
};
