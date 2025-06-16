import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "@/utils";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({
  onSearch,
  placeholder = "Tìm kiếm phim, diễn viên...",
  className = "",
}: SearchBarProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const popularSearches = [
    "Khi Ngón Tay Anh Chạm Vào Hơi Ấm Của Em",
    "Thủ Huyện Đại Nhân",
    "Pit Babe",
    "Tình Yêu Không Có Lỗi",
    "Công Chúa Báo Thù",
  ];

  // Debounced search for suggestions
  const debouncedSearch = debounce((searchQuery: string) => {
    if (searchQuery.trim()) {
      // Handle search suggestions
    }
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
    debouncedSearch(value);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query);
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-gray-800/80 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
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
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-600 z-50 max-h-96 overflow-y-auto">
          {query ? (
            <div className="p-4">
              <div className="text-sm text-gray-400 mb-2">
                Tìm kiếm cho: "{query}"
              </div>
              <button
                onClick={handleSearch}
                className="w-full text-left p-2 hover:bg-gray-700 rounded flex items-center text-white"
              >
                <svg
                  className="w-4 h-4 mr-3 text-gray-400"
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
                <span className="font-medium">Tìm kiếm "{query}"</span>
              </button>
            </div>
          ) : (
            <div className="p-4">
              <div className="text-sm text-gray-400 mb-3">
                Tìm kiếm phổ biến
              </div>
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(search);
                    onSearch?.(search);
                    setIsOpen(false);
                    navigate(`/search?q=${encodeURIComponent(search)}`);
                  }}
                  className="w-full text-left p-2 hover:bg-gray-700 rounded text-white text-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
