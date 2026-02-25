import { motion } from "framer-motion";
import {
  FiBell,
  FiSun,
  FiMoon,
  FiLogOut,
  FiBook,
  FiBarChart2,
} from "react-icons/fi";
import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";
import useUiStore from "../../store/useUiStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const _MotionRef = motion;

const InstructorHeader = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { openProfile, setOpenProfile, closeAll } = useUiStore();
  const navigate = useNavigate();

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 px-6 md:px-16 pt-4 backdrop-blur-2xl"
      onClick={closeAll}
    >
      <div
        className="flex justify-between items-center bg-(--color-primary) text-white rounded-3xl px-6 py-3 shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT SIDE */}
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold">
            {t("components.instructorHeader.title")}
          </h1>

          <span className="hidden md:block text-xs bg-white/20 px-3 py-1 rounded-full">
            {t("components.instructorHeader.role")}
          </span>

          <div className="hidden md:flex items-center gap-4 text-sm">
            <button
              onClick={() => navigate("/instructor/courses")}
              className="flex items-center gap-2 hover:text-emerald-300 transition"
            >
              <FiBook size={16} /> {t("components.instructorHeader.courses")}
            </button>

            <button
              onClick={() => navigate("/instructor/analytics")}
              className="flex items-center gap-2 hover:text-emerald-300 transition"
            >
              <FiBarChart2 size={16} />{" "}
              {t("components.instructorHeader.analytics")}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5 relative">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {theme === "dark" ? (
              <FiSun className="text-yellow-300" />
            ) : (
              <FiMoon />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
            <FiBell />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-(--color-danger) rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-3 bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20 transition"
            >
              <div className="w-8 h-8 bg-white text-(--color-primary) font-bold rounded-full flex items-center justify-center">
                {user?.name?.charAt(0)}
              </div>

              <span className="hidden md:block text-sm font-medium">
                {user?.name}
              </span>
            </button>

            {openProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-3 w-52 bg-(--card-bg) text-(--text-primary) rounded-xl shadow-lg border border-(--border-color)"
              >
                <button
                  onClick={() => {
                    toast("Profile page will be available soon!");
                    closeAll();
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-(--bg-muted)"
                >
                  {t("components.instructorHeader.myProfile")}
                </button>

                <button
                  onClick={() => {
                    toast("Settings page will be available soon!");
                    closeAll();
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-(--bg-muted)"
                >
                  {t("components.instructorHeader.settings")}
                </button>

                <button
                  onClick={() => {
                    logout();
                    closeAll();
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-(--bg-muted) flex items-center gap-2 text-(--color-danger)"
                >
                  <FiLogOut /> {t("components.instructorHeader.logout")}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default InstructorHeader;
