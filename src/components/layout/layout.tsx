import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
