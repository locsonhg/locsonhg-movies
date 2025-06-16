import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "@/components/search-bar";

export const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Phim bộ", href: "/phim-bo" },
    { name: "Phim lẻ", href: "/phim-le" },
    { name: "Hoạt hình", href: "/hoat-hinh" },
    { name: "TV Shows", href: "/tv-shows" },
    { name: "Thể loại", href: "/categories" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-sm border-b border-gray-800"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto px-2.5 lg:px-14">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg">
                <span className="text-white font-bold text-xl">LH</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">
                Locsonhg
              </span>
            </Link>

            {/* Desktop Navigation - moved next to logo */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section - Search and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - moved to right side */}
            <div className="hidden lg:block">
              <SearchBar />
            </div>

            {/* Mobile Search - takes remaining space */}
            <div className="lg:hidden flex-1 mx-4">
              <SearchBar />
            </div>

            {/* VIP Badge */}
            <div className="hidden md:flex items-center">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full">
                <span className="text-black font-bold text-sm">VIP</span>
              </div>
            </div>

            {/* User Menu */}
            <button className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition-colors duration-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    showMobileMenu
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="md:hidden bg-black/95 border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setShowMobileMenu(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full inline-block">
                <span className="text-black font-bold text-sm">VIP</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
