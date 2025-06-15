import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@/components/layout";
import { HomePage } from "@/pages/home-page-new";
import { MoviesPage } from "@/pages";
import { WatchMoviePage } from "@/pages/watch-movie";
import { ErrorBoundary } from "./error-boundary";

// Route definitions
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "movies",
        children: [
          {
            index: true,
            element: <MoviesPage />,
          },
          {
            path: ":id",
            element: <div>Movie Detail Page - Coming Soon</div>,
          },
        ],
      },
      {
        path: "watch/:slug",
        element: <WatchMoviePage />,
      },
      {
        path: "search",
        element: <div>Search Page - Coming Soon</div>,
      },
      {
        path: "favorites",
        element: <div>Favorites Page - Coming Soon</div>,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
