import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMoviesByType, useCategories, useSearchMovies } from "@/hooks";
import { MovieCard } from "@/components/movie-card";
import { Button } from "@/components/ui";
import type { Movie, MovieType, MovieListParams, SearchParams } from "@/types";

// Debounce utility function
const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Mapping for movie type titles and descriptions
const movieTypeConfig: Record<
  string,
  { title: string; description: string; type: MovieType }
> = {
  "phim-bo": {
    title: "Phim Bộ",
    description: "Khám phá những bộ phim dài tập hấp dẫn nhất",
    type: "phim-bo",
  },
  "phim-le": {
    title: "Phim Lẻ",
    description: "Những bộ phim điện ảnh chất lượng cao",
    type: "phim-le",
  },
  "hoat-hinh": {
    title: "Hoạt Hình",
    description: "Thế giới hoạt hình đầy màu sắc cho mọi lứa tuổi",
    type: "hoat-hinh",
  },
  "tv-shows": {
    title: "TV Shows",
    description: "Các chương trình truyền hình và talk show hot nhất",
    type: "tv-shows",
  },
};

export const MovieTypePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<"modified.time" | "_id" | "year">(
    "modified.time"
  );
  const [sortType, setSortType] = useState<"desc" | "asc">("desc");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // Extract type from pathname
  const type = location.pathname.slice(1); // Remove leading slash
  const config = movieTypeConfig[type] || null;

  // Fetch categories for filtering
  const { data: categoriesData } = useCategories();

  // Debounced search functionality
  const debouncedSearch = useCallback(
    debounce((keyword: string) => {
      setSearchKeyword(keyword);
      setPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Parameters for movie queries
  const movieParams: MovieListParams = {
    page,
    sort_field: sortField,
    sort_type: sortType,
    limit: 24,
    ...(selectedCategory && { category: selectedCategory }),
  };

  // Parameters for search queries
  const searchParams: SearchParams = {
    keyword: searchKeyword,
    page,
    sort_field: sortField,
    sort_type: sortType,
    limit: 24,
    ...(selectedCategory && { category: selectedCategory }),
  };

  // Use search or regular movie query based on whether user is searching
  const { data: moviesData, isLoading: moviesLoading } = useMoviesByType(
    config?.type as MovieType,
    movieParams
  );

  const { data: searchData, isLoading: searchLoading } =
    useSearchMovies(searchParams);

  // Determine which data to use
  const isSearchActive = searchKeyword.trim().length >= 2;
  const activeData = isSearchActive ? searchData : moviesData;
  const activeLoading = isSearchActive ? searchLoading : moviesLoading;

  const movies = activeData?.data?.items || activeData?.items || [];
  const pagination =
    activeData?.data?.params?.pagination || activeData?.pagination;

  const handleMovieClick = (movie: Movie) => {
    navigate(`/watch/${movie.slug}`);
  };

  const handleSortChange = (field: string, type: string) => {
    setSortField(field as "modified.time" | "_id" | "year");
    setSortType(type as "desc" | "asc");
    setPage(1);
  };

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
    setSearchKeyword("");
    setPage(1);
  };

  // If invalid type, show 404
  if (!config) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16 lg:pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Không tìm thấy loại phim này
            </h2>
            <p className="text-gray-400 mb-6">
              Loại phim bạn đang tìm kiếm không tồn tại
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-green-500 hover:bg-green-600"
            >
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-16 lg:pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{config.title}</h1>
          <p className="text-gray-400">{config.description}</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          {/* Search Input */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={`Tìm kiếm ${config.title.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 placeholder-gray-400"
              />
            </div>

            {/* Category Filter */}
            <div className="sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
              >
                <option value="">Tất cả thể loại</option>
                {categoriesData?.map((category) => (
                  <option key={category._id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Options and Clear Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-white font-medium">Sắp xếp:</span>
              <select
                value={`${sortField}-${sortType}`}
                onChange={(e) => {
                  const [field, type] = e.target.value.split("-");
                  handleSortChange(field, type);
                }}
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
              >
                <option value="modified.time-desc">Mới cập nhật</option>
                <option value="modified.time-asc">Cũ nhất</option>
                <option value="year-desc">Năm (Mới → Cũ)</option>
                <option value="year-asc">Năm (Cũ → Mới)</option>
                <option value="_id-desc">ID (Z → A)</option>
                <option value="_id-asc">ID (A → Z)</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(selectedCategory || searchQuery) && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="text-gray-400 border-gray-600 hover:bg-gray-700 hover:text-white text-sm"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {(selectedCategory || isSearchActive) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-400 text-sm">
                Bộ lọc đang áp dụng:
              </span>
              {isSearchActive && (
                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm border border-green-500/30">
                  Tìm kiếm: "{searchKeyword}"
                </span>
              )}
              {selectedCategory && (
                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm border border-blue-500/30">
                  Thể loại:{" "}
                  {
                    categoriesData?.find((c) => c.slug === selectedCategory)
                      ?.name
                  }
                </span>
              )}
            </div>
          )}
        </div>
        {/* Movies Grid */}
        {activeLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {Array.from({ length: 24 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
              {movies.map((movie: Movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  onClick={handleMovieClick}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-white border-gray-600 hover:bg-gray-800"
                >
                  ← Trang trước
                </Button>

                <span className="text-sm text-gray-400">
                  Trang {pagination.currentPage} / {pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= pagination.totalPages}
                  className="text-white border-gray-600 hover:bg-gray-800"
                >
                  Trang sau →
                </Button>
              </div>
            )}

            {/* Movie Stats */}
            {pagination && (
              <div className="text-center mt-6 text-sm text-gray-500">
                Hiển thị {movies.length} trong tổng số{" "}
                {pagination.totalItems.toLocaleString()} phim
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">
              Không tìm thấy phim nào
            </div>
            <p className="text-gray-500 text-sm">
              Vui lòng thử lại sau hoặc chọn loại phim khác
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
