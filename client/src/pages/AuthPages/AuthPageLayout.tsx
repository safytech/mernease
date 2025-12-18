import React, { useEffect } from "react";
import GridShape from "../../components/common/GridShape";
import { Link, useLocation } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

const APP_NAME = import.meta.env.VITE_APP_NAME;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();

  useEffect(() => {
    let path = location.pathname;

    const segments = path
      .replace(/^\/+|\/+$/g, "")
      .split("/")
      .filter(Boolean);

    let title = "";
    if (segments.length === 0) {
      title = "Dashboard";
    } else {
      const usableSegments =
        segments[0].toLowerCase() === "auth" ? segments.slice(1) : segments;

      title = usableSegments
        .map((s) => {
          return s
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
        })
        .join(" ");
    }

    document.title = `${title} | ${APP_NAME}`;
  }, [location.pathname]);

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/" className="block mb-4">
                <img
                  width={231}
                  height={48}
                  src="/images/logo/logo-dark.png"
                  alt="Logo"
                />
              </Link>
              <p className="text-center text-gray-400 dark:text-white/60">
                The fastest way to kickstart your MERN app with authentication, routing, and clean architecture built-in.
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
