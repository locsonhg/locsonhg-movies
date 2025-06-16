import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import {
  useNewMovies,
  useSeriesMovies,
  useSingleMovies,
  useAnimationMovies,
  useVietsubMovies,
  useThuyetMinhMovies,
  useLongTiengMovies,
  useTVShows,
} from "@/hooks";
import { movieService } from "@/services/movie-service";
import { HeroSection } from "@/components/hero-section-new";
import { MovieSection } from "@/components";
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

export const HomePage = () => {
  const navigate = useNavigate();

  // Helper function to extract movies array from API response
  const getMoviesArray = (response: any) => {
    return response?.data?.items || response?.items || [];
  };

  // Fetch different types of movies with larger limits
  const { data: newMovies, isLoading: newMoviesLoading } = useNewMovies(1);
  const { data: seriesMovies, isLoading: seriesLoading } = useSeriesMovies({
    limit: 10,
    sort_field: "modified.time",
    sort_type: "desc",
  });
  const { data: singleMovies, isLoading: singleLoading } = useSingleMovies({
    limit: 10,
    sort_field: "modified.time",
    sort_type: "desc",
  });
  const { data: animationMovies, isLoading: animationLoading } =
    useAnimationMovies({
      limit: 10,
      sort_field: "modified.time",
      sort_type: "desc",
    });
  const { data: vietsubMovies, isLoading: vietsubLoading } = useVietsubMovies({
    limit: 10,
    sort_field: "modified.time",
    sort_type: "desc",
  });
  const { data: thuyetMinhMovies, isLoading: thuyetMinhLoading } =
    useThuyetMinhMovies({
      limit: 10,
      sort_field: "modified.time",
      sort_type: "desc",
    });
  const { data: longTiengMovies, isLoading: longTiengLoading } =
    useLongTiengMovies({
      limit: 10,
      sort_field: "modified.time",
      sort_type: "desc",
    });
  const { data: tvShows, isLoading: tvShowsLoading } = useTVShows({
    limit: 10,
    sort_field: "modified.time",
    sort_type: "desc",
  });

  const handleMovieClick = (movie: any) => {
    navigate(`/watch/${movie.slug}`);
  };

  // Get featured movies list first (without details)
  const featuredMoviesList = useMemo(() => {
    return (
      getMoviesArray(newMovies)
        ?.filter((movie: Movie) => movie.poster_url && movie.name && movie.slug)
        ?.slice(0, 5) || []
    );
  }, [newMovies]);

  // Fetch detailed information for each featured movie
  const featuredMovieQueries = useQueries({
    queries: featuredMoviesList.map((movie: Movie) => ({
      queryKey: ["movie-detail", movie.slug],
      queryFn: () => movieService.getMovieDetail(movie.slug),
      enabled: !!movie.slug,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })),
  });

  // Combine basic movie data with detailed data
  const featuredMoviesWithDetails: EnhancedMovie[] = useMemo(() => {
    return featuredMoviesList.map((movie: Movie, index: number) => {
      const detailQuery = featuredMovieQueries[index];
      const detailData = detailQuery?.data as any;
      const detailMovie = detailData?.movie || detailData;

      return {
        ...movie,
        // Use detail data if available, fallback to basic data
        content: detailMovie?.content || movie.content || "",
        director: detailMovie?.director || movie.director || [],
        actor: detailMovie?.actor || movie.actor || [],
        trailer_url: detailMovie?.trailer_url || movie.trailer_url || "",
        episodes: detailMovie?.episodes || [],
        // Enhanced data for better display
        overview:
          detailMovie?.content ||
          movie.content ||
          `Phim ${movie.name} thuộc thể loại ${
            movie.category?.map((c) => c.name).join(", ") || "Drama"
          }, được sản xuất năm ${movie.year}.`,
        backdrop_path:
          detailData?.thumb_url || movie.thumb_url || movie.poster_url,
        genres: movie.category?.map((cat: any) => ({ name: cat.name })) || [],
        vote_average:
          detailData?.tmdb?.vote_average || movie.tmdb?.vote_average || 7.5,
        isDetailLoaded: detailQuery?.isSuccess || false,
        isDetailLoading: detailQuery?.isLoading || false,
      };
    });
  }, [featuredMoviesList, featuredMovieQueries]);

  // Check if any detail queries are still loading
  const featuredMoviesLoading =
    featuredMovieQueries.some((query) => query.isLoading) || newMoviesLoading;

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section - Full Screen Slider */}
      <HeroSection
        featuredMovies={featuredMoviesWithDetails}
        isLoading={featuredMoviesLoading}
        onMovieClick={handleMovieClick}
      />

      {/* Main Content */}
      <div className="bg-gradient-to-b from-black via-gray-900 to-black mt-3">
        {/* Đề xuất hot Section - Horizontal Scroll */}

        {/* Main Movie Sections */}
        <div className="px-4 sm:px-6 lg:px-14 pb-12 space-y-12">
          {/* Miễn phí trọn bộ có thời hạn */}
          <MovieSection
            title="Đề xuất Hot"
            movies={getMoviesArray(thuyetMinhMovies)}
            isLoading={thuyetMinhLoading}
            onMovieClick={handleMovieClick}
            showBadge={true}
            badgeText="HOT"
            badgeColor="bg-gradient-to-r from-red-500 to-orange-500"
          />

          {/* Đề xuất cho bạn */}
          <MovieSection
            title="Đề xuất cho bạn"
            movies={getMoviesArray(seriesMovies)}
            isLoading={seriesLoading}
            onMovieClick={handleMovieClick}
            showBadge={true}
            badgeText="TOP 10"
            badgeColor="bg-gradient-to-r from-purple-500 to-pink-500"
          />

          {/* Phim Bộ Mới Nhất */}
          <MovieSection
            title="Phim Bộ Mới Nhất"
            movies={getMoviesArray(seriesMovies)}
            isLoading={seriesLoading}
            onMovieClick={handleMovieClick}
          />

          {/* Phim Lẻ Hay Nhất */}
          <MovieSection
            title="Phim Lẻ Hay Nhất"
            movies={getMoviesArray(singleMovies)}
            isLoading={singleLoading}
            onMovieClick={handleMovieClick}
          />

          {/* Hoạt Hình Đặc Sắc */}
          <MovieSection
            title="Hoạt Hình Đặc Sắc"
            movies={getMoviesArray(animationMovies)}
            isLoading={animationLoading}
            onMovieClick={handleMovieClick}
            showBadge={true}
            badgeText="ANIME"
            badgeColor="bg-gradient-to-r from-blue-500 to-cyan-500"
          />

          {/* Phim Vietsub */}
          <MovieSection
            title="Phim Vietsub"
            movies={getMoviesArray(vietsubMovies)}
            isLoading={vietsubLoading}
            onMovieClick={handleMovieClick}
            showBadge={true}
            badgeText="VIETSUB"
            badgeColor="bg-gradient-to-r from-indigo-500 to-purple-500"
          />

          {/* Phim Thuyết Minh */}
          <MovieSection
            title="Phim Thuyết Minh"
            movies={getMoviesArray(thuyetMinhMovies)}
            isLoading={thuyetMinhLoading}
            onMovieClick={handleMovieClick}
            showBadge={true}
            badgeText="THUYẾT MINH"
            badgeColor="bg-gradient-to-r from-amber-500 to-orange-500"
          />

          {/* Phim Lồng Tiếng */}
          <MovieSection
            title="Phim Lồng Tiếng"
            movies={getMoviesArray(longTiengMovies)}
            isLoading={longTiengLoading}
            onMovieClick={handleMovieClick}
            showBadge={true}
            badgeText="LỒNG TIẾNG"
            badgeColor="bg-gradient-to-r from-emerald-500 to-teal-500"
          />

          {/* TV Shows */}
          <MovieSection
            title="TV Shows"
            movies={getMoviesArray(tvShows)}
            isLoading={tvShowsLoading}
            onMovieClick={handleMovieClick}
            showBadge={true}
            badgeText="TV"
            badgeColor="bg-gradient-to-r from-violet-500 to-purple-500"
          />
        </div>

        {/* Quick Categories - iQIYI Style */}
        <div className="px-4 sm:px-6 lg:px-14 pb-12">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
            <h2 className="text-2xl font-bold mb-6 text-white">
              Danh Mục Phổ Biến
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {[
                {
                  name: "Hành Động",
                  icon: "⚡",
                  color: "from-red-500 to-orange-500",
                },
                {
                  name: "Tình Cảm",
                  icon: "💕",
                  color: "from-pink-500 to-rose-500",
                },
                {
                  name: "Hài Hước",
                  icon: "😄",
                  color: "from-yellow-500 to-orange-500",
                },
                {
                  name: "Kinh Dị",
                  icon: "👻",
                  color: "from-purple-500 to-violet-500",
                },
                {
                  name: "Khoa Học",
                  icon: "🚀",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  name: "Tài Liệu",
                  icon: "📚",
                  color: "from-green-500 to-teal-500",
                },
                {
                  name: "Chiến Tranh",
                  icon: "⚔️",
                  color: "from-gray-500 to-slate-500",
                },
                {
                  name: "Thể Thao",
                  icon: "🏆",
                  color: "from-amber-500 to-yellow-500",
                },
              ].map((category) => (
                <button
                  key={category.name}
                  className={`bg-gradient-to-br ${category.color} p-4 rounded-lg text-white font-medium text-sm hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl group`}
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                    {category.icon}
                  </div>
                  <div className="text-xs">{category.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
