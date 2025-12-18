import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "../../context/LoadingContext";
import { useTheme } from "../../context/ThemeContext";

const GlobalLoader: React.FC = () => {
  const { isLoading } = useLoading();
  const { theme, primaryColor } = useTheme();

  const secondaryColor =
    theme === "dark"
      ? lightenColor(primaryColor, 25)
      : lightenColor(primaryColor, 15);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="global-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="absolute inset-0 z-[60] flex flex-col items-center justify-center 
                     bg-white/60 dark:bg-black/40 backdrop-blur-[2px] pointer-events-none 
                     rounded-2xl"
        >
          {/* Spinner */}
          <motion.div
            className="relative flex items-center justify-center pointer-events-none"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="w-14 h-14 border-4 border-transparent rounded-full animate-spin"
              style={{
                borderTopColor: primaryColor,
                borderLeftColor: primaryColor,
                transition: "border-color 0.35s ease-in-out",
              }}
            />
            <div
              className="absolute w-10 h-10 border-4 border-transparent rounded-full animate-spin-slow"
              style={{
                borderTopColor: secondaryColor,
                borderLeftColor: secondaryColor,
                transition: "border-color 0.35s ease-in-out",
              }}
            />
          </motion.div>

          <motion.p
            className="mt-4 text-sm font-medium tracking-wide select-none pointer-events-none"
            style={{
              color: primaryColor,
              transition: "color 0.35s ease-in-out",
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Loading, please wait...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function lightenColor(hex: string, percent: number) {
  try {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  } catch {
    return hex;
  }
}

export default GlobalLoader;
