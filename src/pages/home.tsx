import { HeroSection } from "@/components/hero-section";
import { MovieRow } from "@/components/movie-row";
import { useNewMovies, useMoviesByType } from "@/hooks/use-movies";
import type { Movie } from "@/types";

export const HomePage = () => {
  console.log("HomePage component rendered!");

  // Fetch data using React Query hooks
  const { data: newMovies, isLoading: isLoadingNew } = useNewMovies(1);
  const { data: seriesMovies, isLoading: isLoadingSeries } =
    useMoviesByType("phim-bo");
  const { data: singleMovies, isLoading: isLoadingSingle } =
    useMoviesByType("phim-le");
  const { data: cartoonMovies, isLoading: isLoadingCartoon } =
    useMoviesByType("hoat-hinh");
  const { data: tvShowMovies, isLoading: isLoadingTvShow } =
    useMoviesByType("tv-shows");

  // Get featured movies from new movies for hero section
  const featuredMovies = newMovies?.items?.slice(0, 5) || [];

  console.log("Featured Movies:", featuredMovies);
  console.log("New Movies Data:", newMovies);
  console.log("Is Loading:", isLoadingNew);
  console.log("First movie structure:", newMovies?.items?.[0]);

  const handleMovieClick = (movie: Movie) => {
    console.log("Movie clicked:", movie);
    // Navigate to movie detail page
    // navigate(`/movie/${movie.slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section with Featured Movies */}
      <div className="relative">
        {/* Hero Section */}
        <HeroSection featuredMovies={featuredMovies} isLoading={isLoadingNew} />

        {/* Đề xuất hot - overlay on hero background */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent">
          <div className="mx-auto px-2.5 lg:px-14 pb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                🔥 <span className="ml-2">Đề xuất hot</span>
              </h2>
              <button className="text-green-400 hover:text-green-300 font-medium text-sm flex items-center">
                Xem tất cả
                <span className="ml-1">→</span>
              </button>
            </div>

            {/* Hot Movies Row */}
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
              {(newMovies?.items || []).slice(0, 8).map((movie, index) => (
                <div
                  key={movie._id}
                  className="relative min-w-[180px] group cursor-pointer"
                  onClick={() => handleMovieClick(movie)}
                >
                  {/* TOP Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      HOT
                    </div>
                  </div>

                  {/* Ranking Number */}
                  <div className="absolute top-2 right-2 z-10">
                    <div className="w-8 h-8 bg-yellow-500 text-black rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                    <div className="aspect-[2/3] overflow-hidden">
                      <img
                        src={movie.poster_url || movie.thumb_url}
                        alt={movie.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/300x450?text=No+Image";
                        }}
                      />
                    </div>

                    <div className="p-3">
                      <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                        {movie.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{movie.year}</span>
                        <span className="bg-green-500 text-black px-1 rounded font-bold">
                          {movie.quality}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Categories */}
      <section className="py-12 bg-gradient-to-b from-gray-800/30 to-gray-900">
        <div className="mx-auto px-2.5 lg:px-14">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Khám phá thể loại
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              {
                name: "Phim bộ",
                icon: "📺",
                href: "/series",
                color: "from-blue-500 to-blue-600",
              },
              {
                name: "Phim lẻ",
                icon: "🎬",
                href: "/movies",
                color: "from-purple-500 to-purple-600",
              },
              {
                name: "Hoạt hình",
                icon: "🎨",
                href: "/cartoons",
                color: "from-pink-500 to-pink-600",
              },
              {
                name: "TV Shows",
                icon: "📻",
                href: "/tv-shows",
                color: "from-green-500 to-green-600",
              },
              {
                name: "Thể loại",
                icon: "🎭",
                href: "/categories",
                color: "from-yellow-500 to-yellow-600",
              },
              {
                name: "Quốc gia",
                icon: "🌍",
                href: "/countries",
                color: "from-red-500 to-red-600",
              },
            ].map((category) => (
              <div
                key={category.name}
                className="group relative overflow-hidden bg-gray-800/50 hover:bg-gray-700/50 rounded-xl p-6 text-center transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                ></div>
                <div className="relative z-10">
                  <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <span className="text-white text-sm font-medium group-hover:text-white transition-colors duration-300">
                    {category.name}
                  </span>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-xl transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Movie Sections */}
      <div className="mx-auto px-2.5 lg:px-14 py-8 space-y-12">
        {/* Đề xuất hot */}
        <MovieRow
          title="🔥 Đề xuất hot"
          movies={newMovies?.items?.slice(0, 12) || []}
          isLoading={isLoadingNew}
          onMovieClick={handleMovieClick}
          showBadge={true}
          badgeText="HOT"
        />

        {/* Phim bộ mới nhất */}
        <MovieRow
          title="📺 Phim bộ mới nhất"
          movies={seriesMovies?.items || []}
          isLoading={isLoadingSeries}
          onMovieClick={handleMovieClick}
        />

        {/* Phim lẻ hay nhất */}
        <MovieRow
          title="🎬 Phim lẻ hay nhất"
          movies={singleMovies?.items || []}
          isLoading={isLoadingSingle}
          onMovieClick={handleMovieClick}
        />

        {/* Hoạt hình nổi bật */}
        <MovieRow
          title="🎨 Hoạt hình nổi bật"
          movies={cartoonMovies?.items || []}
          isLoading={isLoadingCartoon}
          onMovieClick={handleMovieClick}
        />

        {/* TV Shows trending */}
        <MovieRow
          title="📻 TV Shows trending"
          movies={tvShowMovies?.items || []}
          isLoading={isLoadingTvShow}
          onMovieClick={handleMovieClick}
          showBadge={true}
          badgeText="TOP 10"
        />

        {/* Phim Việt Nam */}
        <MovieRow
          title="🇻🇳 Phim Việt Nam"
          movies={
            newMovies?.items
              ?.filter((movie: any) =>
                movie.country?.some((c: any) =>
                  c.name?.toLowerCase().includes("việt")
                )
              )
              .slice(0, 12) || []
          }
          isLoading={isLoadingNew}
          onMovieClick={handleMovieClick}
        />
      </div>

      {/* Stats Section */}
      <section className="bg-gray-800 py-16">
        <div className="mx-auto px-2.5 lg:px-14">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Locsonhg - Nền tảng phim hàng đầu
            </h2>
            <p className="text-gray-300 text-lg">
              Xem phim chất lượng cao, cập nhật nhanh nhất
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Phim có sẵn", value: "50,000+", icon: "🎬" },
              { label: "Người dùng", value: "10M+", icon: "👥" },
              { label: "Quốc gia", value: "20+", icon: "🌍" },
              { label: "Chất lượng", value: "4K HDR", icon: "⭐" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="text-4xl">{stat.icon}</div>
                <div className="text-3xl font-bold text-green-400">
                  {stat.value}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="mx-auto px-2.5 lg:px-14">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Tính năng nổi bật
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Chất lượng cao",
                description: "Phim 4K, Full HD với âm thanh Dolby",
                icon: "🎥",
              },
              {
                title: "Cập nhật nhanh",
                description: "Phim mới nhất được cập nhật hàng ngày",
                icon: "⚡",
              },
              {
                title: "Đa nền tảng",
                description: "Xem trên điện thoại, máy tính, TV",
                icon: "📱",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
