import { useState } from "react";
import { useNewMovies } from "@/hooks";
import { MovieCard } from "@/components";
import { Button } from "@/components";

export const MoviesPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, isError } = useNewMovies(page);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải phim...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">Lỗi tải dữ liệu</h2>
          <p>{error?.message || "Đã xảy ra lỗi không xác định"}</p>
        </div>
      </div>
    );
  }

  const movies = data?.items || [];
  const pagination = data?.pagination;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Phim Mới Cập Nhật
        </h1>
        <p className="text-gray-600">
          Khám phá những bộ phim mới nhất được cập nhật
        </p>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {movies.map((movie: any) => (
          <MovieCard
            key={movie._id}
            movie={movie}
            onClick={(_movie: any) => {
              // TODO: Navigate to movie detail page
            }}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Trang trước
          </Button>

          <span className="text-sm text-gray-600">
            Trang {pagination.currentPage} / {pagination.totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= pagination.totalPages}
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
    </div>
  );
};
