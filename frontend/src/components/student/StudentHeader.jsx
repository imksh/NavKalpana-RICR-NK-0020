import React, { useState, useEffect, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { FiBell, FiSun, FiMoon, FiLogOut } from "react-icons/fi";
import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";
import useUiStore from "../../store/useUiStore";
import { useTranslation } from "react-i18next";
import ChangeLanguage from "../ChangeLanguage";

const StudentHeader = () => {
  const { t } = useTranslation();

  const { user, logout } = useAuthStore();
  const { mobileOpen, setMobileOpen, closeAll, openProfile, setOpenProfile } =
    useUiStore();
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const { theme, toggleTheme } = useThemeStore();

  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: showHeader ? 0 : -120 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 w-full z-50 px-4 md:px-16 pt-4 backdrop-blur-md items-center"
      onClick={(e) => {
        e.stopPropagation();
        setOpenProfile(false);
      }}
    >
      <div className="flex justify-between items-center bg-(--color-primary) rounded-3xl px-6 py-3 shadow-md text-white ">
        {/* LOGO */}
        <Link to="/student" className="flex items-center">
          {/* <img
            src={logo}
            alt="Gradify"
            className="w-20 object-contain cursor-pointer"
          /> */}
          <p className="text-2xl font-bold text-white">{t("header.brand")}</p>
        </Link>

        <div
          className={`hidden md:flex items-center gap-5 lg:absolute lg:left-[50%] lg:-translate-x-[50%] h-full  `}
        >
          <button
            onClick={() => {
              navigate("/student");
              setMobileOpen(false);
            }}
            className={`${location.pathname === "/student" ? "text-(--color-primary-hover)" : "text-white"} cursor-pointer hover:text-(--color-primary-hover) transition font-semibold`}
          >
            {t("header.home")}
          </button>

          <button
            onClick={() => {
              navigate("/student/courses");
              setMobileOpen(false);
            }}
            className={`${location.pathname === "/student/courses" ? "text-(--color-primary-hover)" : "text-white"} cursor-pointer hover:text-(--color-primary-hover) transition font-semibold`}
          >
            {t("header.course")}
          </button>

          <button
            onClick={() => {
              navigate("/student/support");
              setMobileOpen(false);
            }}
            className={`${location.pathname === "/student/support" ? "text-(--color-primary-hover)" : "text-white"} cursor-pointer hover:text-(--color-primary-hover) transition font-semibold`}
          >
            {t("header.support")}
          </button>
        </div>

        <div className="flex items-center lg:gap-3 relative  ml-auto md:ml-0">
          {/* Notification */}
          <motion.button
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate("/student/notifications")}
            className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition mr-4 cursor-pointer group duration-500"
          >
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              className="group-hover:rotate-45 "
            >
              <FiBell />
            </motion.div>
            <span className="absolute top-0 right-0 w-2 h-2 bg-(--color-danger) rounded-full "></span>
          </motion.button>

          {/* Profile */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-3 bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20 transition cursor-pointer"
              onMouseEnter={() => setOpenProfile(true)}
              onMouseLeave={() => setOpenProfile(false)}
            >
              <div className="w-8 h-8 !bg-white text-(--color-primary) font-bold rounded-full flex items-center justify-center">
                {user?.name?.charAt(0)}
              </div>
              <span className="hidden md:block text-sm font-medium text-white">
                {user?.name}
              </span>
            </button>

            <AnimatePresence mode="wait">
              {openProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="absolute right-0 mt-3 w-48 bg-(--card-bg) text-(--text-primary) rounded-xl shadow-lg border border-(--border-color)"
                  onMouseEnter={() => {
                    setOpenProfile(true);
                  }}
                  onMouseLeave={() => {
                    closeAll();
                  }}
                >
                  <button
                    onClick={() => {
                      navigate("/student/profile");
                      closeAll();
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-(--bg-muted)"
                  >
                    {t("header.profile")}
                  </button>

                  <button
                    onClick={() => {
                      navigate("/student/assignments");
                      closeAll();
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-(--bg-muted)"
                  >
                    {t("header.assignments")}
                  </button>
                  <button
                    onClick={() => {
                      navigate("/student/quizzes");
                      closeAll();
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-(--bg-muted)"
                  >
                    {t("header.quizzes")}
                  </button>
                  <button
                    onClick={() => {
                      navigate("/student/attendance");
                      closeAll();
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-(--bg-muted)"
                  >
                    {t("header.attendance")}
                  </button>

                  <button
                    onClick={() => {
                      navigate("/student/progress");
                      closeAll();
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-(--bg-muted)"
                  >
                    {t("header.progress")}
                  </button>

                  <button
                    onClick={() => {
                      navigate("/student/jobs");
                      closeAll();
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-(--bg-muted)"
                  >
                    {t("header.jobs")}
                  </button>

                  <button
                    onClick={() => {
                      navigate("/student/alumini");
                      closeAll();
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-(--bg-muted)"
                  >
                    {t("header.alumini")}
                  </button>

                  <button
                    onClick={toggleTheme}
                    className="w-full text-left px-4 py-3 hover:bg-(--bg-muted) flex gap-2 items-center"
                  >
                    {theme === "dark"
                      ? t("header.lightMode")
                      : t("header.darkMode")}
                    <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                      {theme === "dark" ? (
                        <FiSun className="text-yellow-300" />
                      ) : (
                        <FiMoon />
                      )}
                    </div>
                  </button>

                  <div className="w-full text-left p-2 hover:bg-(--bg-muted) flex gap-2 items-center">
                    <ChangeLanguage />
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      closeAll();
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-(--bg-muted) flex items-center gap-2 text-(--color-danger)"
                  >
                    <FiLogOut /> {t("header.logout")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE TOGGLE */}
        <div className="md:hidden text-white">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? (
              <IoCloseSharp size={24} />
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
            className="md:hidden mt-3 bg-(--color-primary) rounded-2xl p-4 flex flex-col text-white"
          >
            <button
              onClick={() => {
                navigate("/student/profile");
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-(--bg-muted)"
            >
              {t("header.profile")}
            </button>

            <button
              onClick={() => {
                navigate("/student/assignments");
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-(--bg-muted)"
            >
              {t("header.assignments")}
            </button>
            <button
              onClick={() => {
                navigate("/student/quizzes");
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-(--bg-muted)"
            >
              {t("header.quizzes")}
            </button>
            <button
              onClick={() => {
                navigate("/student/attendance");
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-(--bg-muted)"
            >
              {t("header.attendance")}
            </button>

            <button
              onClick={() => {
                navigate("/student/progress");
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-(--bg-muted)"
            >
              {t("header.progress")}
            </button>

            <button
              onClick={() => {
                navigate("/student/jobs");
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-(--bg-muted)"
            >
              {t("header.jobs")}
            </button>

            <button
              onClick={() => {
                navigate("/student/alumini");
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-(--bg-muted)"
            >
              {t("header.alumini")}
            </button>

            <button
              onClick={() => {
                toggleTheme();
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-(--bg-muted) flex gap-2 items-center"
            >
              <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                {theme === "dark" ? (
                  <FiSun className="text-yellow-300" />
                ) : (
                  <FiMoon />
                )}
              </div>
              {theme === "dark" ? t("header.lightMode") : t("header.darkMode")}
            </button>

            <ChangeLanguage />

            <button
              onClick={() => {
                logout();
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-(--bg-muted) flex items-center gap-2 text-(--color-danger)"
            >
              <FiLogOut /> {t("header.logout")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default StudentHeader;
