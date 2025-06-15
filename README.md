# Locsonhg Movie App

Ứng dụng React được xây dựng với Vite, TypeScript, Tailwind CSS và các thư viện hiện đại.

## Tính năng

- ⚡️ **Vite** - Build tool nhanh và hiện đại
- ⚛️ **React 18** - Thư viện UI mạnh mẽ
- 🔷 **TypeScript** - Tăng cường type safety
- 🎨 **Tailwind CSS** - Framework CSS utility-first
- 🌐 **React Router** - Routing cho SPA
- 🔄 **TanStack Query** - Data fetching và caching
- 📡 **Axios** - HTTP client
- 📁 **@ Alias** - Import paths ngắn gọn từ `src/`
- 🔧 **ESLint** - Code linting
- 📦 **Hot Module Replacement** - Phát triển nhanh chóng

## Cấu trúc dự án

```
locsonhgMovie/
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # UI components (Button, Input, etc.)
│   │   └── movie-card.tsx
│   ├── pages/          # Page components
│   │   ├── home-page.tsx
│   │   └── movies-page.tsx
│   ├── hooks/          # Custom React hooks
│   │   ├── use-async.ts
│   │   ├── use-toggle.ts
│   │   └── use-movies.ts # React Query hooks
│   ├── services/       # API services
│   │   └── movie-service.ts
│   ├── lib/           # Library configurations
│   │   ├── axios.ts   # Axios setup
│   │   └── react-query.tsx # React Query setup
│   ├── router/        # React Router setup
│   │   ├── index.tsx
│   │   ├── layout.tsx
│   │   └── error-boundary.tsx
│   ├── types/         # TypeScript definitions
│   ├── utils/         # Utility functions
│   ├── contexts/      # React contexts
│   └── assets/        # Static assets
├── public/            # Public assets
├── .env.example       # Environment variables example
├── package.json       # Dependencies
├── vite.config.ts     # Vite configuration với @ alias
├── tsconfig.json      # TypeScript configuration
├── tailwind.config.js # Tailwind CSS configuration
└── postcss.config.js  # PostCSS configuration
```

## Bắt đầu

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. API Setup (Tùy chọn)

Dự án sử dụng [PhimAPI](https://phimapi.com/) - API phim Việt Nam miễn phí, không cần API key.

API này cung cấp:

- 🎬 Phim Việt Nam với đầy đủ thông tin
- 🆓 Hoàn toàn miễn phí, không cần đăng ký
- 📱 Hỗ trợ nhiều loại phim: phim bộ, phim lẻ, hoạt hình, TV shows
- 🎭 Thể loại và quốc gia đa dạng
- 🔍 Tính năng tìm kiếm mạnh mẽ

### 3. Chạy development server

```bash
npm run dev
```

### Build cho production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Sử dụng @ Alias

Bạn có thể import từ thư mục `src/` bằng cách sử dụng `@` alias:

```typescript
// Thay vì
import Component from "../../../components/Component";

// Sử dụng
import Component from "@/components/Component";
```

## Tailwind CSS

Dự án đã được cấu hình sẵn Tailwind CSS. Bạn có thể sử dụng utility classes trong các component:

```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg">Hello Tailwind!</div>
```

## Phát triển

1. **Components**: Tạo component mới trong `src/components/`
2. **Pages**: Tạo page mới trong `src/pages/`
3. **Hooks**: Tạo custom hooks trong `src/hooks/`
4. **Utils**: Tạo utility functions trong `src/utils/`

Tất cả có thể được import bằng `@` alias!
