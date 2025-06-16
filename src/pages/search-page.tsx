import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSearchMovies, useCategories } from "@/hooks";
import { MovieCard } from "@/components/movie-card";
import { Button } from "@/components/ui";
import type {
  Movie,
  SearchParams as MovieSearchParams,
  Category,
} from "@/types";

// Debounce utility function
const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<"modified.time" | "_id" | "year">(
    "modified.time"
  );
  const [sortType, setSortType] = useState<"desc" | "asc">("desc");

  // Fetch categories for filtering
  const { data: categoriesData } = useCategories();
  const categories = categoriesData || [];

  // Debounced search functionality
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      setDebouncedQuery(searchQuery);
      setPage(1);

      // Update URL parameters
      if (searchQuery.trim()) {
        setSearchParams({ q: searchQuery });
      } else {
        setSearchParams({});
      }
    }, 500),
    [setSearchParams]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  // Search parameters
  const movieSearchParams: MovieSearchParams = {
    keyword: debouncedQuery,
    page,
    sort_field: sortField,
    sort_type: sortType,
    limit: 24,
    ...(selectedCategory && { category: selectedCategory }),
  };

  // Fetch search results
  const { data: searchData, isLoading: searchLoading } =
    useSearchMovies(movieSearchParams);

  const movies = searchData?.data?.items || [];
  const pagination = searchData?.data.params?.pagination;
  const isSearchActive = debouncedQuery.trim().length >= 2;

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

  const clearFilters = () => {
    setSelectedCategory("");
    setPage(1);
  };

  const clearSearch = () => {
    setQuery("");
    setDebouncedQuery("");
    setSelectedCategory("");
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-16 lg:pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Tìm Kiếm Phim</h1>
          <p className="text-gray-400">
            Tìm kiếm phim, diễn viên và nội dung yêu thích của bạn
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Tìm kiếm phim, diễn viên..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-green-500 placeholder-gray-400 text-lg"
              autoFocus
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {query ? (
                <button
                  onClick={clearSearch}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        {isSearchActive && (
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <div className="sm:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                >
                  <option value="">Tất cả thể loại</option>
                  {categories.map((category: Category) => (
                    <option key={category._id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div className="sm:w-64">
                <select
                  value={`${sortField}-${sortType}`}
                  onChange={(e) => {
                    const [field, type] = e.target.value.split("-");
                    handleSortChange(field, type);
                  }}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
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
              {selectedCategory && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="text-gray-400 border-gray-600 hover:bg-gray-700 hover:text-white"
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-400 text-sm">Đang tìm kiếm:</span>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30">
                "{debouncedQuery}"
              </span>
              {selectedCategory && (
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/30">
                  Thể loại:{" "}
                  {
                    categories.find(
                      (c: Category) => c.slug === selectedCategory
                    )?.name
                  }
                </span>
              )}
            </div>
          </div>
        )}

        {/* Search Results */}
        {!isSearchActive ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Tìm kiếm phim yêu thích
            </h2>
            <p className="text-gray-400">
              Nhập tên phim, diễn viên hoặc từ khóa để bắt đầu tìm kiếm
            </p>
          </div>
        ) : searchLoading ? (
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
            <div className="mb-4">
              <p className="text-gray-400 text-sm">
                Tìm thấy {pagination?.totalItems || movies.length} kết quả cho "
                {debouncedQuery}"
                {selectedCategory &&
                  ` trong thể loại ${
                    categories.find(
                      (c: Category) => c.slug === selectedCategory
                    )?.name
                  }`}
              </p>
            </div>

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
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Không tìm thấy kết quả
            </h2>
            <p className="text-gray-400 mb-4">
              Không tìm thấy phim nào với từ khóa "{debouncedQuery}"
              {selectedCategory &&
                ` trong thể loại ${
                  categories.find((c: Category) => c.slug === selectedCategory)
                    ?.name
                }`}
            </p>
            <div className="space-x-4">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="text-gray-400 border-gray-600 hover:bg-gray-700 hover:text-white"
              >
                Xóa bộ lọc
              </Button>
              <Button
                onClick={clearSearch}
                className="bg-green-500 hover:bg-green-600"
              >
                Tìm kiếm mới
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
