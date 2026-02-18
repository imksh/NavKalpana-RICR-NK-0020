import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore";

const ThemeBubble = () => {
  const { isAnimating, theme } = useThemeStore();

  // Determine next theme
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 40 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed top-0 right-0 w-90 h-90 -translate-y-[50%] translate-x-[50%] rounded-full pointer-events-none z-[9999]"
          style={{
            background: nextTheme === "dark" ? "#0f172a" : "#f9fafb",
            transformOrigin: "top right",
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default ThemeBubble;
