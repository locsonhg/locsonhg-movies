import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useMovieDetail, useSeriesMovies } from "@/hooks";
import { VideoPlayer } from "@/components/video-player";
import { EpisodeList } from "@/components/episode-list";
import { MovieInfo } from "@/components/movie-info";
import { RecommendedMovies } from "@/components/recommended-movies";
import { ServerList } from "@/components/server-list";
import type { Movie, EpisodeData, Episode } from "@/types";

export const WatchMoviePage = () => {
  const { slug, episodeSlug } = useParams<{
    slug: string;
    episodeSlug?: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentEpisode, setCurrentEpisode] = useState<EpisodeData | null>(
    null
  );
  const [currentServer, setCurrentServer] = useState<Episode | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  console.log({
    currentEpisode,
    currentServer,
    slug,
  });

  // Fetch movie detail
  const {
    data: movieDetailResponse,
    isLoading: movieDetailLoading,
    error,
  } = useMovieDetail(slug || "");

  // Fetch recommended movies
  const { data: recommendedMovies, isLoading: recommendedLoading } =
    useSeriesMovies({
      limit: 12,
      sort_field: "modified.time",
      sort_type: "desc",
    });

  const movieDetail = movieDetailResponse?.movie;
  const episodes = movieDetailResponse?.episodes || [];

  // Reset state when slug changes (switching to different movie)
  useEffect(() => {
    setCurrentEpisode(null);
    setCurrentServer(null);
    setShowTrailer(false);
  }, [slug]);

  // Set initial server and episode when movie data loads
  useEffect(() => {
    if (episodes.length > 0 && !currentServer) {
      setCurrentServer(episodes[0]);

      // If there's an episodeSlug in URL, try to find and set that episode
      if (episodeSlug && episodes[0]?.server_data?.length > 0) {
        const foundEpisode = episodes[0].server_data.find(
          (ep: EpisodeData) => ep.slug === episodeSlug
        );
        if (foundEpisode) {
          setCurrentEpisode(foundEpisode);
        } else {
          // If episode not found, redirect to first episode
          const firstEpisode = episodes[0].server_data[0];
          setCurrentEpisode(firstEpisode);
          const newPath = `/watch/${slug}/${firstEpisode.slug}`;
          navigate(newPath, { replace: true });
        }
      } else if (episodes[0]?.server_data?.length > 0) {
        // No episodeSlug in URL, redirect to first episode
        const firstEpisode = episodes[0].server_data[0];
        setCurrentEpisode(firstEpisode);
        const newPath = `/watch/${slug}/${firstEpisode.slug}`;
        navigate(newPath, { replace: true });
      }
    }
  }, [episodes, currentServer, episodeSlug, slug, navigate]);

  const handleEpisodeSelect = (episode: EpisodeData) => {
    setCurrentEpisode(episode);
    setShowTrailer(false);

    // Update URL to include episode slug
    const newPath = `/watch/${slug}/${episode.slug}`;
    navigate(newPath, { replace: true });
  };

  const handleServerSelect = (server: Episode) => {
    setCurrentServer(server);
    if (server.server_data?.length > 0) {
      setCurrentEpisode(server.server_data[0]);
      // Update URL to include the first episode of the new server
      const newPath = `/watch/${slug}/${server.server_data[0].slug}`;
      navigate(newPath, { replace: true });
    }
    setShowTrailer(false);
  };

  const handleWatchTrailer = () => {
    setShowTrailer(true);
    // When watching trailer, navigate back to base movie URL
    const newPath = `/watch/${slug}`;
    navigate(newPath, { replace: true });
  };

  const handleMovieClick = (movie: Movie) => {
    navigate(`/watch/${movie.slug}`);
  };

  const goBack = () => {
    navigate(-1);
  };

  const getVideoSource = () => {
    if (showTrailer && movieDetail?.trailer_url) {
      return movieDetail.trailer_url;
    }

    if (!currentEpisode) return undefined;

    // Try different video sources
    const videoSrc =
      currentEpisode.link_m3u8 || currentEpisode.link_embed || undefined;
    return videoSrc;
  };

  const getRecommendedMovies = () => {
    const response = recommendedMovies as any;
    return response?.data?.items || response?.items || [];
  };

  if (movieDetailLoading) {
    return (
      <div className="min-h-screen bg-black">
        {/* Loading Skeleton */}
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="bg-gray-800 aspect-video rounded-lg mb-6"></div>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-gray-800 h-48 rounded-lg mb-6"></div>
                <div className="bg-gray-800 h-32 rounded-lg"></div>
              </div>
              <div className="bg-gray-800 h-96 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movieDetail) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Không tìm thấy phim
          </h1>
          <p className="text-gray-400 mb-4">
            Phim bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={goBack}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Main Content - Better padding for mobile */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 pt-16 lg:pt-20 pb-4 lg:pb-6">
        {/* Video Player Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
            <VideoPlayer
              key={`${slug}-${currentEpisode?.slug || "default"}-${
                showTrailer ? "trailer" : "episode"
              }`}
              src={getVideoSource()}
              poster={movieDetail?.thumb_url || undefined}
              title={
                showTrailer
                  ? `${movieDetail?.name} - Trailer`
                  : `${movieDetail?.name} - ${currentEpisode?.name || "Tập 1"}`
              }
            />
          </div>
        </div>

        {/* Episode Info Banner - Better mobile layout */}
        {currentEpisode && !showTrailer && currentServer && (
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-3 lg:p-4 mb-4 lg:mb-6 border border-green-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-white font-semibold text-sm lg:text-base">
                  Đang xem: {movieDetail.name} - {currentEpisode.name}
                </h2>
                <p className="text-gray-300 text-xs lg:text-sm">
                  {currentServer.server_data &&
                  currentServer.server_data.length > 1
                    ? `${
                        currentServer.server_data.findIndex(
                          (ep: any) => ep.slug === currentEpisode.slug
                        ) + 1
                      }/${currentServer.server_data.length} tập`
                    : "Phim lẻ"}{" "}
                  • {currentServer.server_name.replace("#", "").trim()}
                </p>
              </div>
              <div className="flex space-x-2">
                {showTrailer ? (
                  <button
                    onClick={() => setShowTrailer(false)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-sm lg:text-base"
                  >
                    Xem phim
                  </button>
                ) : movieDetail.trailer_url ? (
                  <button
                    onClick={handleWatchTrailer}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-sm lg:text-base"
                  >
                    Xem Trailer
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Content Grid - Better Responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Movie Info & Episodes */}
          <div className="xl:col-span-2 space-y-6">
            {/* Movie Information */}
            <MovieInfo
              movie={movieDetail as Movie}
              movieDetail={movieDetail}
              onWatchTrailer={handleWatchTrailer}
            />

            {/* Server Selection */}
            {episodes.length > 0 && (
              <ServerList
                servers={episodes}
                currentServer={currentServer?.server_name}
                onServerSelect={handleServerSelect}
              />
            )}

            {/* Episode List */}
            {currentServer?.server_data &&
              currentServer.server_data.length > 0 && (
                <EpisodeList
                  episodes={currentServer.server_data}
                  currentEpisode={currentEpisode?.slug}
                  onEpisodeSelect={handleEpisodeSelect}
                />
              )}
          </div>

          {/* Right Column - Recommended Movies */}
          <div className="xl:col-span-1">
            <RecommendedMovies
              movies={getRecommendedMovies()}
              onMovieClick={handleMovieClick}
              isLoading={recommendedLoading}
            />
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12 bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            Bình luận ({Math.floor(Math.random() * 500) + 50})
          </h3>

          {/* Comment Form */}
          <div className="mb-6">
            <textarea
              placeholder="Viết bình luận của bạn..."
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-4 resize-none focus:outline-none focus:border-green-500"
              rows={3}
            />
            <div className="flex justify-end mt-3">
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Đăng bình luận
              </button>
            </div>
          </div>

          {/* Sample Comments */}
          <div className="space-y-4">
            {[
              {
                user: "Người xem 1",
                time: "2 giờ trước",
                content: "Phim hay quá! Cảm ơn admin đã upload.",
                likes: 15,
              },
              {
                user: "Fan phim",
                time: "5 giờ trước",
                content: "Chất lượng rất tốt, xem rất mượt. Chờ tập tiếp theo.",
                likes: 8,
              },
              {
                user: "Khán giả",
                time: "1 ngày trước",
                content: "Cốt truyện hấp dẫn, diễn viên diễn hay. Recommend!",
                likes: 23,
              },
            ].map((comment, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {comment.user[0]}
                    </div>
                    <div>
                      <p className="text-white font-medium">{comment.user}</p>
                      <p className="text-gray-400 text-xs">{comment.time}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-red-400 transition-colors text-sm">
                    ❤️ {comment.likes}
                  </button>
                </div>
                <p className="text-gray-300">{comment.content}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <button className="text-green-400 hover:text-green-300 font-medium">
              Xem thêm bình luận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
