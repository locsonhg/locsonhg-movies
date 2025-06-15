import { Link } from "react-router-dom";

export const Footer = () => {
  const footerSections = [
    {
      title: "Thể loại phim",
      links: [
        { name: "Hành động", href: "/categories/hanh-dong" },
        { name: "Tình cảm", href: "/categories/tinh-cam" },
        { name: "Hài hước", href: "/categories/hai-huoc" },
        { name: "Kinh dị", href: "/categories/kinh-di" },
        {
          name: "Khoa học viễn tưởng",
          href: "/categories/khoa-hoc-vien-tuong",
        },
      ],
    },
    {
      title: "Quốc gia",
      links: [
        { name: "Việt Nam", href: "/countries/viet-nam" },
        { name: "Hàn Quốc", href: "/countries/han-quoc" },
        { name: "Trung Quốc", href: "/countries/trung-quoc" },
        { name: "Nhật Bản", href: "/countries/nhat-ban" },
        { name: "Thái Lan", href: "/countries/thai-lan" },
      ],
    },
    {
      title: "Hỗ trợ",
      links: [
        { name: "Liên hệ", href: "/contact" },
        { name: "Câu hỏi thường gặp", href: "/faq" },
        { name: "Điều khoản sử dụng", href: "/terms" },
        { name: "Chính sách bảo mật", href: "/privacy" },
        { name: "Báo cáo lỗi", href: "/report" },
      ],
    },
    {
      title: "Kết nối",
      links: [
        { name: "Facebook", href: "#" },
        { name: "YouTube", href: "#" },
        { name: "Instagram", href: "#" },
        { name: "Twitter", href: "#" },
        { name: "TikTok", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto px-2.5 lg:px-14 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold text-lg mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App Download Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-6 lg:mb-0">
              <h3 className="text-white font-semibold text-lg mb-4">
                Tải ứng dụng Locsonhg
              </h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-black hover:bg-gray-800 transition-colors duration-200 rounded-lg p-3 flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold text-sm">iOS</span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Tải trên</div>
                    <div className="text-white font-semibold">App Store</div>
                  </div>
                </a>
                <a
                  href="#"
                  className="bg-black hover:bg-gray-800 transition-colors duration-200 rounded-lg p-3 flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">GP</span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Tải trên</div>
                    <div className="text-white font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {["Facebook", "YouTube", "Instagram", "Twitter"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors duration-200"
                >
                  <div className="w-5 h-5 bg-gray-400 rounded"></div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2025 Locsonhg. Tất cả quyền được bảo lưu.</p>
            </div>
            <div className="flex items-center space-x-6">
              <span>Phiên bản: 1.0.0</span>
              <span>|</span>
              <span>Cập nhật: {new Date().toLocaleDateString("vi-VN")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
