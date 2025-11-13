import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";

export default function Layout() {
  const location = useLocation();
  const noHeaderFooter = location.pathname.includes("404");
  return (
    <div className="min-h-screen flex flex-col bg-amber-50">
      {!noHeaderFooter && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!noHeaderFooter && <Footer />}
      <ToastContainer position="top-center" />
    </div>
  );
}