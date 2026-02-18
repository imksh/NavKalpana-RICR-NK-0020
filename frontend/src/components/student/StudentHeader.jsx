import { motion } from "framer-motion";
import { FiBell, FiSun, FiMoon, FiLogOut } from "react-icons/fi";
import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";
import useUiStore from "../../store/useUiStore";
import { useNavigate } from "react-router-dom";

const StudentHeader = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { openProfile, setOpenProfile, closeAll } = useUiStore();
  const navigate = useNavigate();

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 px-6 md:px-16 pt-4"
      onClick={closeAll} // close on outside click
    >
      <div
        className="flex justify-between items-center bg-(--color-primary) text-white rounded-3xl px-6 py-3 shadow-md"
        onClick={(e) => e.stopPropagation()} // prevent closing inside
      >

        {/* LEFT */}
        <h1 className="text-xl font-semibold !text-white">
          Gradify
        </h1>

        {/* RIGHT */}
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

          {/* Notification */}
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
                className="absolute right-0 mt-3 w-48 bg-(--card-bg) text-(--text-primary) rounded-xl shadow-lg border border-(--border-color)"
              >
                <button
                  onClick={() => {
                    navigate("/student/profile");
                    closeAll();
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-(--bg-muted)"
                >
                  My Profile
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

export default StudentHeader;