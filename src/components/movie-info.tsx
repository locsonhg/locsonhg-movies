import {
  Star,
  Calendar,
  Globe,
  User,
  Heart,
  Share2,
  Bookmark,
} from "lucide-react";
import type { Movie } from "@/types";

interface MovieInfoProps {
  movie: Movie;
  movieDetail?: any;
  onWatchTrailer?: () => void;
}

export const MovieInfo = ({
  movie,
  movieDetail,
  onWatchTrailer,
}: MovieInfoProps) => {
  const formatRating = (rating?: number) => {
    if (!rating) return "8.5";
    return rating.toFixed(1);
  };

  const formatViewCount = (count?: number) => {
    if (!count) return "1.2M";
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      {/* Movie Title and Rating */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-4 sm:space-y-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {movie.name}
            </h1>
            <p className="text-gray-400 text-base sm:text-lg">
              {movie.origin_name}
            </p>
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="text-center">
              <div className="flex items-center justify-center bg-yellow-500 text-black px-3 py-1 rounded-lg font-bold text-sm sm:text-base">
                <Star
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                  fill="currentColor"
                />
                {formatRating(
                  movieDetail?.tmdb?.vote_average || movie.tmdb?.vote_average
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                ({formatViewCount(movieDetail?.tmdb?.vote_count || 12500)} đánh
                giá)
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Yêu thích</span>
            <span className="sm:hidden">Thích</span>
          </button>

          <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base">
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Chia sẻ</span>
            <span className="sm:hidden">Chia sẻ</span>
          </button>

          <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base">
            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Lưu</span>
            <span className="sm:hidden">Lưu</span>
          </button>
        </div>

        {/* Movie Stats */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400 mb-6">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{movie.year}</span>
          </div>

          <div className="flex items-center space-x-1">
            <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{movie.country?.[0]?.name || "Việt Nam"}</span>
          </div>

          <div className="flex items-center space-x-1">
            <User className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{movie.episode_current}</span>
          </div>

          <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
            {movie.quality}
          </div>

          <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
            {movie.lang}
          </div>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-6">
          {movie.category?.map((cat, index) => (
            <span
              key={index}
              className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-700 cursor-pointer transition-colors"
            >
              {cat.name}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-3">Mô tả</h3>
        <p className="text-gray-300 leading-relaxed">
          {movieDetail?.content ||
            movie.content ||
            `${movie.name} là một bộ phim ${movie.category
              ?.map((c) => c.name)
              .join(", ")} 
            được sản xuất năm ${movie.year}. Với chất lượng ${movie.quality} và 
            ${
              movie.episode_current
            }, đây hứa hẹn sẽ là một tác phẩm điện ảnh đáng xem.`}
        </p>
      </div>

      {/* Cast and Crew */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Director */}
        {(movieDetail?.director || movie.director) && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Đạo diễn</h4>
            <p className="text-gray-300">
              {Array.isArray(movieDetail?.director || movie.director)
                ? (movieDetail?.director || movie.director).join(", ")
                : movieDetail?.director || movie.director}
            </p>
          </div>
        )}

        {/* Cast */}
        {(movieDetail?.actor || movie.actor) && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Diễn viên</h4>
            <p className="text-gray-300">
              {Array.isArray(movieDetail?.actor || movie.actor)
                ? (movieDetail?.actor || movie.actor).join(", ")
                : movieDetail?.actor || movie.actor}
            </p>
          </div>
        )}
      </div>

      {/* Trailer Button */}
      {(movieDetail?.trailer_url || movie.trailer_url) && (
        <div className="mt-6">
          <button
            onClick={onWatchTrailer}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-medium transition-all"
          >
            Xem Trailer
          </button>
        </div>
      )}
    </div>
  );
};
