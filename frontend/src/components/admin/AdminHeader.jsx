import { motion } from "framer-motion";
import {
  FiBell,
  FiSun,
  FiMoon,
  FiLogOut,
  FiUsers,
  FiBook,
  FiBarChart2,
  FiShield
} from "react-icons/fi";
import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";
import useUiStore from "../../store/useUiStore";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { openProfile, setOpenProfile, closeAll } = useUiStore();
  const navigate = useNavigate();

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 px-6 md:px-16 pt-4"
      onClick={closeAll}
    >
      <div
        className="flex justify-between items-center bg-(--color-primary) text-white rounded-3xl px-6 py-3 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= LEFT SIDE ================= */}
        <div className="flex items-center gap-6">

          <div className="flex items-center gap-3">
            <FiShield className="text-yellow-300" />
            <h1 className="text-xl font-semibold">
              Admin Control Panel
            </h1>
          </div>

          <span className="hidden md:block text-xs bg-yellow-400 text-black px-3 py-1 rounded-full font-semibold">
            SUPER ADMIN
          </span>

          {/* QUICK NAV */}
          <div className="hidden md:flex items-center gap-5 text-sm">

            <button
              onClick={() => navigate("/admin/users")}
              className="flex items-center gap-2 hover:text-emerald-300 transition"
            >
              <FiUsers size={16} /> Users
            </button>

            <button
              onClick={() => navigate("/admin/courses")}
              className="flex items-center gap-2 hover:text-emerald-300 transition"
            >
              <FiBook size={16} /> Courses
            </button>

            <button
              onClick={() => navigate("/admin/reports")}
              className="flex items-center gap-2 hover:text-emerald-300 transition"
            >
              <FiBarChart2 size={16} /> Reports
            </button>

          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
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

          {/* Profile */}
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
                    navigate("/admin/profile");
                    closeAll();
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-(--bg-muted)"
                >
                  Admin Profile
                </button>

                <button
                  onClick={() => {
                    navigate("/admin/settings");
                    closeAll();
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-(--bg-muted)"
                >
                  Platform Settings
                </button>

                <button
                  onClick={() => {
                    logout();
                    closeAll();
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-(--bg-muted) flex items-center gap-2 text-(--color-danger)"
                >
                  <FiLogOut /> Logout
                </button>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default AdminHeader;