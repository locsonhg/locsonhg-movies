import { Movie } from "@/types";
import { Star, Play } from "lucide-react";

interface RecommendedMoviesProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  isLoading?: boolean;
}

export const RecommendedMovies = ({
  movies,
  onMovieClick,
  isLoading = false,
}: RecommendedMoviesProps) => {
  const displayCount = 12;

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-white mb-4">
          Đề xuất cho bạn
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-800 aspect-[3/4] rounded-lg mb-2"></div>
              <div className="bg-gray-800 h-4 rounded mb-1"></div>
              <div className="bg-gray-800 h-3 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-white mb-4">
          Đề xuất cho bạn
        </h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎬</div>
          <p className="text-gray-400">Không có phim đề xuất</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 md:p-6">
      <h3 className="text-lg md:text-xl font-bold text-white mb-4">
        Đề xuất cho bạn
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {movies.slice(0, displayCount).map((movie) => (
          <div
            key={movie._id}
            className="group cursor-pointer"
            onClick={() => onMovieClick(movie)}
          >
            <div className="relative overflow-hidden rounded-lg bg-gray-800 aspect-[3/4] mb-2">
              {/* Movie Poster */}
              <img
                src={
                  movie.poster_url
                    ? `https://phimimg.com/${movie.poster_url}`
                    : "/placeholder-movie.jpg"
                }
                alt={movie.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-movie.jpg";
                }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                <Play className="w-6 h-6 md:w-8 md:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Quality Badge */}
              {movie.quality && (
                <div className="absolute top-1 left-1 md:top-2 md:left-2 bg-green-500 text-white text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                  {movie.quality}
                </div>
              )}

              {/* Episode Info */}
              {movie.episode_current && (
                <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                  {movie.episode_current}
                </div>
              )}

              {/* Rating */}
              {movie.tmdb?.vote_average && (
                <div className="absolute bottom-1 left-1 md:bottom-2 md:left-2 flex items-center bg-black/70 text-white text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                  <Star
                    className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1 text-yellow-500"
                    fill="currentColor"
                  />
                  {movie.tmdb.vote_average.toFixed(1)}
                </div>
              )}
            </div>

            {/* Movie Info */}
            <div className="space-y-1">
              <h4 className="text-white font-medium text-xs md:text-sm line-clamp-2 group-hover:text-green-400 transition-colors">
                {movie.name}
              </h4>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{movie.year}</span>
                {movie.country && movie.country[0] && (
                  <span className="hidden sm:block">
                    {movie.country[0].name}
                  </span>
                )}
              </div>

              {/* Genres */}
              {movie.category && movie.category.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {movie.category.slice(0, 1).map((cat, index) => (
                    <span
                      key={index}
                      className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded"
                    >
                      {cat.name}
                    </span>
                  ))}
                  {movie.category.length > 1 && (
                    <span className="text-xs text-gray-500">
                      +{movie.category.length - 1}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {movies.length > displayCount && (
        <div className="text-center mt-6">
          <button className="text-green-400 hover:text-green-300 font-medium transition-colors">
            Xem thêm ({movies.length - displayCount} phim)
          </button>
        </div>
      )}
    </div>
  );
};
