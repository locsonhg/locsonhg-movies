import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "@/utils";
import { SearchBar } from "@/components/search-bar";

export const Layout = () => {
  const location = useLocation();

  const isActiveLink = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Làm Giàng Tiên", path: "/category/lam-giang-tien" },
    { name: "Đề xuất", path: "/recommended" },
    { name: "Khác", path: "/other", hasDropdown: true },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center font-bold text-xl">
                iQ
              </div>
              <span className="text-xl font-bold hidden sm:block">iQIYI</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <div key={item.path} className="relative">
                  <Link
                    to={item.path}
                    className={cn(
                      "px-3 py-2 text-sm font-medium transition-colors relative",
                      isActiveLink(item.path)
                        ? "text-green-400"
                        : "text-gray-300 hover:text-white"
                    )}
                  >
                    {item.name}
                    {item.hasDropdown && <span className="ml-1">▼</span>}
                    {isActiveLink(item.path) && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400"></div>
                    )}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8 hidden lg:block">
              <SearchBar
                onSearch={(query) => {
                  // Navigate to search page
                }}
                className="w-full"
              />
            </div>

            {/* Right Menu */}
            <div className="flex items-center space-x-4">
              {/* Search Icon for mobile */}
              <button className="lg:hidden p-2 text-gray-300 hover:text-white">
                <svg
                  className="w-5 h-5"
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
              </button>

              {/* History */}
              <button className="hidden sm:flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">Lịch sử xem</span>
              </button>

              {/* Language */}
              <button className="hidden sm:flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                <span className="text-sm">Ngôn ngữ</span>
              </button>

              {/* Profile */}
              <button className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-sm hidden sm:block">Của tôi</span>
              </button>

              {/* VIP Badge */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                VIP SALE
              </div>

              {/* Mobile menu button */}
              <button className="md:hidden p-2 text-gray-300 hover:text-white">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-4">
            <SearchBar
              onSearch={(query) => {
                // Handle search
              }}
              className="w-full"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center font-bold text-xl">
                  iQ
                </div>
                <span className="text-xl font-bold">iQIYI</span>
              </div>
              <p className="text-gray-400 text-sm">
                Nền tảng giải trí hàng đầu với hàng ngàn bộ phim, series và
                chương trình truyền hình chất lượng cao.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Danh mục</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Phim bộ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Phim lẻ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Hoạt hình
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    TV Shows
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Trung tâm trợ giúp
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Điều khoản
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Quyền riêng tư
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Ứng dụng</h4>
              <div className="flex space-x-2">
                <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm transition-colors">
                  📱 APP
                </button>
                <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded text-sm font-bold">
                  👑 VIP
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Locsonhg Movie App. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
