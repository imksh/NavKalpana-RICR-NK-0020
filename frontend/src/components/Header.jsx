import React, { useState, useEffect, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useAuthStore } from "../store/useAuthStore";
import useUiStore from "../store/useUiStore";
import { FiSun, FiMoon } from "react-icons/fi";
import { useThemeStore } from "../store/useThemeStore";

const Header = () => {
  const { user, logout } = useAuthStore();
  const { mobileOpen, setMobileOpen } = useUiStore();
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const { theme, toggleTheme } = useThemeStore();

  const navigate = useNavigate();
  const location = useLocation().pathname;

  /* ============================= */
  /*      HIDE HEADER ON SCROLL    */
  /* ============================= */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setShowHeader(false);
        setMobileOpen(false);
      } else {
        setShowHeader(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ============================= */
  /*     NAVIGATION HELPERS        */
  /* ============================= */

  const handleDashboard = () => {
    if (!user) return navigate("/");

    switch (user.role) {
      case "student":
        navigate("/student");
        break;
      case "instructor":
        navigate("/instructor");
        break;
      case "admin":
        navigate("/admin");
        break;
      default:
        navigate("/");
    }
  };

  /* ============================= */
  /*           RENDER              */
  /* ============================= */

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: showHeader ? 0 : -120 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 w-full z-50 px-4 md:px-16 pt-4 backdrop-blur-md "
    >
      <div className="flex justify-between items-center bg-[var(--color-primary)] rounded-3xl px-6 py-3 shadow-md">
        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Gradify"
            className="w-20 object-contain cursor-pointer"
          />
          <p className="text-2xl font-bold text-white">Gradify</p>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6 text-white font-medium">
          <Link
            to="/"
            className={location === "/" ? "text-emerald-300" : ""}
          >
            Home
          </Link>

          <Link
            to="/about"
            className={
              location === "/about" ? "text-emerald-300" : ""
            }
          >
            About
          </Link>

          <Link
            to="/contact"
            className={
              location === "/contact" ? "text-emerald-300" : ""
            }
          >
            Contact
          </Link>

          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="hover:text-emerald-300"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="bg-[var(--color-accent)] px-4 py-2 rounded-lg hover:opacity-90"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleDashboard}
                className="hover:text-emerald-300"
              >
                Dashboard
              </button>

              <button
                onClick={logout}
                className="bg-red-500 px-4 py-2 rounded-lg hover:opacity-90"
              >
                Logout
              </button>
            </>
          )}

          <button
            onClick={toggleTheme}
            className="ml-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
          >
            {theme === "dark" ? (
              <FiSun size={18} className="text-yellow-400" />
            ) : (
              <FiMoon size={18} className="text-white" />
            )}
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <div className="md:hidden text-white">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? (
              <IoCloseSharp size={28} />
            ) : (
              <GiHamburgerMenu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-3 bg-[var(--color-primary)] rounded-2xl p-4 flex flex-col gap-3 text-white"
          >
            <button
              onClick={() => {
                navigate("/");
                setMobileOpen(false);
              }}
            >
              Home
            </button>

            <button
              onClick={() => {
                navigate("/about");
                setMobileOpen(false);
              }}
            >
              About
            </button>

            <button
              onClick={() => {
                navigate("/contact");
                setMobileOpen(false);
              }}
            >
              Contact
            </button>

            {!user ? (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileOpen(false);
                  }}
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    navigate("/register");
                    setMobileOpen(false);
                  }}
                >
                  Register
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    handleDashboard();
                    setMobileOpen(false);
                  }}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="text-red-400"
                >
                  Logout
                </button>
              </>
            )}
            <button
              onClick={() => {
                toggleTheme();
                setMobileOpen(false);
              }}
              className="flex items-center gap-2"
            >
              {theme === "dark" ? (
                <>
                  <FiSun /> Light Mode
                </>
              ) : (
                <>
                  <FiMoon /> Dark Mode
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
