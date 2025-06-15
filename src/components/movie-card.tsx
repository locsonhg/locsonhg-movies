import type { Movie } from "@/types";

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
}

export const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  // Helper function to get full image URL
  const getImageUrl = (url: string | undefined) => {
    if (!url)
      return "https://via.placeholder.com/300x450/1f2937/ffffff?text=No+Image";
    if (url.startsWith("http")) return url;
    return `https://phimimg.com/${url}`;
  };

  return (
    <div
      className="group relative bg-gray-800/50 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-gray-800/70"
      onClick={() => onClick?.(movie)}
    >
      <div className="aspect-[2/3] overflow-hidden relative">
        <img
          src={getImageUrl(movie.poster_url || movie.thumb_url)}
          alt={movie.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/300x450/1f2937/ffffff?text=No+Image";
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Quality badge */}
        <div className="absolute top-2 left-2 bg-green-500/90 text-white px-2 py-1 rounded-md text-xs font-bold">
          {movie.quality}
        </div>

        {/* Episode badge */}
        {movie.episode_current && (
          <div className="absolute top-2 right-2 bg-blue-500/90 text-white px-2 py-1 rounded-md text-xs font-medium">
            {movie.episode_current}
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3
          className="font-semibold text-white text-lg mb-1 line-clamp-1 group-hover:text-green-400 transition-colors duration-300"
          title={movie.name}
        >
          {movie.name}
        </h3>
        <p
          className="text-sm text-gray-400 mb-2 line-clamp-1"
          title={movie.origin_name}
        >
          {movie.origin_name}
        </p>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-md text-xs">
            {movie.year}
          </span>
          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-md text-xs font-medium truncate">
            {movie.lang}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="capitalize">{movie.type}</span>
          {movie.view > 0 && (
            <span className="flex items-center">
              <svg
                className="w-3 h-3 mr-1"
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
              {movie.view?.toLocaleString() || "0"}
            </span>
          )}
        </div>

        {/* Categories */}
        {movie.category && movie.category.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.category.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="bg-gray-700/30 text-gray-400 px-2 py-1 rounded-md text-xs"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
