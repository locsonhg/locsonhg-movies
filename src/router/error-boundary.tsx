import { useRouteError, Link } from "react-router-dom";
import { Button } from "@/components";

export const ErrorBoundary = () => {
  const error = useRouteError() as any;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">
            {error?.status || "500"}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {error?.status === 404 ? "Trang không tồn tại" : "Đã xảy ra lỗi!"}
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {error?.status === 404
              ? "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển."
              : "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button>🏠 Về trang chủ</Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            ← Quay lại
          </Button>
        </div>

        {/* Development error details */}
        {import.meta.env.DEV && error && (
          <details className="mt-8 text-left bg-red-50 p-4 rounded-lg border border-red-200">
            <summary className="cursor-pointer text-red-700 font-medium">
              Chi tiết lỗi (Development)
            </summary>
            <pre className="mt-2 text-sm text-red-600 overflow-auto">
              {error.message || error.statusText || "Unknown error"}
              {error.stack && (
                <>
                  {"\n\n"}
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};
