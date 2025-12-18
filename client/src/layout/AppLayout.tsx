import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import GlobalLoader from "../components/common/GlobalLoader";

const APP_NAME = import.meta.env.VITE_APP_NAME;

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const modal = document.querySelector(".modal-container");
      setIsModalOpen(!!modal);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const path = location.pathname;
    const segments = path.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
    const title =
      segments.length > 0
        ? segments.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")
        : "Dashboard";
    document.title = `${title} | ${APP_NAME}`;
  }, [location.pathname]);

  return (
    <div className="min-h-screen xl:flex relative overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          isModalOpen
            ? "opacity-0 scale-95 pointer-events-none"
            : "opacity-100 scale-100"
        }`}
      >
        <AppSidebar />
        <Backdrop />
      </div>

      {/* Main content */}
      <div
        className={`flex-1 relative transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        {/* Header */}
        <div
          className={`transition-all duration-300 ${
            isModalOpen
              ? "opacity-0 -translate-y-2 pointer-events-none"
              : "opacity-100 translate-y-0"
          }`}
        >
          <AppHeader />
        </div>

        {/* Loader (main content only) */}
        <div className="absolute top-[64px] bottom-0 left-0 right-0 px-4 md:px-6">
          <GlobalLoader />
        </div>

        {/* Routed content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => (
  <SidebarProvider>
    <LayoutContent />
  </SidebarProvider>
);

export default AppLayout;
