import React, { useState, useEffect, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import useUiStore from "../store/useUiStore";
import {
  FiSun,
  FiMoon,
  FiSearch,
  FiBell,
  FiUser,
  FiLogOut,
  FiSettings,
  FiBookOpen,
} from "react-icons/fi";
import { useThemeStore } from "../store/useThemeStore";
import { useTranslation } from "react-i18next";
import ChangeLanguage from "./ChangeLanguage";

const Header = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const { mobileOpen, setMobileOpen, openProfile, setOpenProfile, closeAll } =
    useUiStore();
  const [showHeader, setShowHeader] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const lastScrollY = useRef(0);
  const profileMenuRef = useRef(null);
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
        setOpenProfile(false);
      } else {
        setShowHeader(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setMobileOpen, setOpenProfile]);

  /* ============================= */
  /*   CLOSE MENU ON OUTSIDE CLICK */
  /* ============================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpenProfile]);

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
    closeAll();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    closeAll();
    navigate("/");
  };

  /* ============================= */
  /*           RENDER              */
  /* ============================= */

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: showHeader ? 0 : -120 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 w-full z-50 px-4 md:px-16 pt-4 backdrop-blur-2xl"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="flex justify-between items-center bg-(--color-primary)/80 backdrop-blur-3xl rounded-3xl px-6 py-3.5 shadow-lg border border-(--color-primary)/40">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
            <FiBookOpen className="text-white" size={20} />
          </div>
          <p className="text-2xl font-bold text-white ">
            {t("header.brand")}
          </p>
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            to="/"
            className={`text-white/90 hover:text-white font-medium transition-colors relative group ${
              location === "/" ? "text-white" : ""
            }`}
          >
            {t("header.home")}
            {location === "/" && (
              <motion.div
                layoutId="activeNav"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"
              />
            )}
          </Link>

          <Link
            to="/courses"
            className={`text-white/90 hover:text-white font-medium transition-colors relative group ${
              location === "/courses" ? "text-white" : ""
            }`}
          >
            {t("header.courses")}
            {location === "/courses" && (
              <motion.div
                layoutId="activeNav"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"
              />
            )}
          </Link>

          <Link
            to="/about"
            className={`text-white/90 hover:text-white font-medium transition-colors relative group ${
              location === "/about" ? "text-white" : ""
            }`}
          >
            {t("header.about")}
            {location === "/about" && (
              <motion.div
                layoutId="activeNav"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"
              />
            )}
          </Link>

          <Link
            to="/contact"
            className={`text-white/90 hover:text-white font-medium transition-colors relative group ${
              location === "/contact" ? "text-white" : ""
            }`}
          >
            {t("header.contact")}
            {location === "/contact" && (
              <motion.div
                layoutId="activeNav"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"
              />
            )}
          </Link>
        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="hidden md:flex p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white"
            aria-label={t("header.search")}
          >
            <FiSearch size={18} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="hidden md:flex p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
            aria-label={t("header.toggleTheme")}
          >
            {theme === "dark" ? (
              <FiSun size={18} className="text-yellow-300" />
            ) : (
              <FiMoon size={18} className="text-white" />
            )}
          </button>

          {/* Language Selector */}
          <div className="hidden md:block text-white">
            <ChangeLanguage />
          </div>

          {/* Conditional: Not Logged In */}
          {!user ? (
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2.5 text-white font-semibold hover:bg-white/10 rounded-xl transition-all"
              >
                {t("header.login")}
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-5 py-2.5 bg-white text-(--color-primary) font-semibold rounded-xl hover:bg-white/90 transition-all shadow-md"
              >
                {t("header.register")}
              </button>
            </div>
          ) : (
            /* Conditional: Logged In */
            <div className="hidden lg:flex items-center gap-3">
              {/* Notifications */}
              <button
                className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white"
                aria-label="Notifications"
              >
                <FiBell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Menu */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => {
                    setOpenProfile(!openProfile);
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <FiUser className="text-white" size={16} />
                  </div>
                  <span className="text-white font-medium hidden xl:block">
                    {user?.name || "User"}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {openProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-(--card-bg) border border-(--border-color) rounded-2xl shadow-xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-(--border-color)">
                        <p className="font-bold text-(--text-primary)">
                          {user?.name}
                        </p>
                        <p className="text-sm text-(--text-secondary)">
                          {user?.email}
                        </p>
                        <span className="inline-block mt-2 px-2 py-1 bg-(--color-primary)/10 text-(--color-primary) text-xs font-medium rounded-lg">
                          {user?.role}
                        </span>
                      </div>

                      <div className="py-2">
                        <button
                          onClick={handleDashboard}
                          className="w-full px-4 py-2.5 text-left hover:bg-(--bg-surface) transition-colors flex items-center gap-3 text-(--text-primary)"
                        >
                          <FiUser size={16} />
                          <span className="font-medium">
                            {t("header.dashboard")}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            navigate("/settings");
                            closeAll();
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-(--bg-surface) transition-colors flex items-center gap-3 text-(--text-primary)"
                        >
                          <FiSettings size={16} />
                          <span className="font-medium">
                            {t("header.settings")}
                          </span>
                        </button>
                      </div>

                      <div className="border-t border-(--border-color) py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2.5 text-left hover:bg-(--color-danger)/10 transition-colors flex items-center gap-3 text-(--color-danger) font-medium"
                        >
                          <FiLogOut size={16} />
                          <span>{t("header.logout")}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setOpenProfile(false);
            }}
            className="lg:hidden p-2 text-white"
            aria-label={t("header.toggleMenu")}
          >
            {mobileOpen ? (
              <IoCloseSharp size={28} />
            ) : (
              <GiHamburgerMenu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* SEARCH BAR OVERLAY */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-3 bg-(--card-bg) backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-(--border-color)"
          >
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <FiSearch
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-secondary)"
                  size={18}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("header.searchPlaceholder")}
                  className="w-full pl-12 pr-4 py-3 bg-(--bg-surface) border border-(--border-color) rounded-xl focus:outline-none focus:border-(--color-primary) text-(--text-primary)"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-(--color-primary) text-white font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                {t("header.search")}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden mt-3 bg-(--color-primary) backdrop-blur-lg rounded-2xl shadow-xl border border-(--border-color) overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {/* User Info (if logged in) */}
              {user && (
                <div className="pb-4 mb-4 border-b border-(--border-color)">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-(--color-primary)/10 rounded-full flex items-center justify-center">
                      <FiUser className="text-(--color-primary)" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-(--text-primary)">
                        {user?.name}
                      </p>
                      <p className="text-sm text-(--text-secondary)">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl hover:bg-(--bg-surface) transition-colors font-medium ${
                  location === "/"
                    ? "bg-(--bg-surface) text-(--color-primary)"
                    : "text-(--text-primary)"
                }`}
              >
                {t("header.home")}
              </Link>

              <Link
                to="/courses"
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl hover:bg-(--bg-surface) transition-colors font-medium ${
                  location === "/courses"
                    ? "bg-(--bg-surface) text-(--color-primary)"
                    : "text-(--text-primary)"
                }`}
              >
                {t("header.courses")}
              </Link>

              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl hover:bg-(--bg-surface) transition-colors font-medium ${
                  location === "/about"
                    ? "bg-(--bg-surface) text-(--color-primary)"
                    : "text-(--text-primary)"
                }`}
              >
                {t("header.about")}
              </Link>

              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl hover:bg-(--bg-surface) transition-colors font-medium ${
                  location === "/contact"
                    ? "bg-(--bg-surface) text-(--color-primary)"
                    : "text-(--text-primary)"
                }`}
              >
                {t("header.contact")}
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={() => {
                  toggleTheme();
                  closeAll();
                }}
                className="w-full px-4 py-3 rounded-xl hover:bg-(--bg-surface) transition-colors flex items-center gap-3 font-medium text-(--text-primary)"
              >
                <div className="p-2 rounded-lg bg-(--bg-surface)">
                  {theme === "dark" ? (
                    <FiSun className="text-yellow-400" size={18} />
                  ) : (
                    <FiMoon className="text-(--color-primary)" size={18} />
                  )}
                </div>
                {theme === "dark"
                  ? t("header.lightMode")
                  : t("header.darkMode")}
              </button>

              {/* Language Selector */}
              <div className="px-4 py-3">
                <ChangeLanguage />
              </div>

              {/* Auth Buttons */}
              {!user ? (
                <div className="pt-4 mt-4 border-t border-(--border-color) space-y-2">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMobileOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-(--bg-surface) border border-(--border-color) text-(--text-primary) font-semibold rounded-xl hover:border-(--color-primary) transition-all"
                  >
                    {t("header.login")}
                  </button>

                  <button
                    onClick={() => {
                      navigate("/register");
                      setMobileOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-(--color-primary) text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                  >
                    {t("header.register")}
                  </button>
                </div>
              ) : (
                <div className="pt-4 mt-4 border-t border-(--border-color) space-y-2">
                  <button
                    onClick={() => {
                      handleDashboard();
                      setMobileOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-(--bg-surface) border border-(--border-color) text-(--text-primary) font-semibold rounded-xl hover:border-(--color-primary) transition-all flex items-center justify-center gap-2"
                  >
                    <FiUser size={18} />
                    {t("header.dashboard")}
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-(--color-danger) text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <FiLogOut size={18} />
                    {t("header.logout")}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
