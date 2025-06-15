export const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        🎬 Chào mừng đến với Locsonhg Movie App
      </h1>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">🔥 Phim Hot</h2>
            <p className="text-blue-100">
              Khám phá những bộ phim đang được yêu thích nhất
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">⭐ Top Rated</h2>
            <p className="text-green-100">
              Những bộ phim được đánh giá cao nhất
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">🆕 Sắp Chiếu</h2>
            <p className="text-purple-100">Cập nhật phim mới sắp ra mắt</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4">Tính năng chính</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-xl">✅</span>
              <div>
                <h4 className="font-medium">Tìm kiếm phim</h4>
                <p className="text-gray-600 text-sm">
                  Tìm kiếm phim yêu thích một cách dễ dàng
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-xl">✅</span>
              <div>
                <h4 className="font-medium">Thông tin chi tiết</h4>
                <p className="text-gray-600 text-sm">
                  Xem thông tin đầy đủ về phim
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-xl">✅</span>
              <div>
                <h4 className="font-medium">Giao diện đẹp</h4>
                <p className="text-gray-600 text-sm">
                  Thiết kế hiện đại với Tailwind CSS
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-xl">✅</span>
              <div>
                <h4 className="font-medium">Responsive</h4>
                <p className="text-gray-600 text-sm">
                  Hoạt động tốt trên mọi thiết bị
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
