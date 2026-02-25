import React, { useState, useEffect, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiBell,
  FiSun,
  FiMoon,
  FiLogOut,
  FiFileText,
  FiCheckSquare,
  FiTrendingUp,
  FiBookOpen,
} from "react-icons/fi";
import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";
import useUiStore from "../../store/useUiStore";
import { useTranslation } from "react-i18next";
import ChangeLanguage from "../ChangeLanguage";
import api from "../../config/api";

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
  /*      CONTEXTUAL DATA          */
  /* ============================= */
  const [contextData, setContextData] = useState({
    pendingAssignments: 0,
    upcomingQuizzes: 0,
    overallScore: 0,
    notificationCount: 0,
  });

  useEffect(() => {
    const fetchContextData = async () => {
      try {
        const [assignmentsRes, quizzesRes, statsRes] = await Promise.all([
          api.get("/student/assignments").catch(() => ({ data: [] })),
          api.get("/student/quizzes").catch(() => ({ data: [] })),
          api.get("/student/stats").catch(() => ({ data: {} })),
        ]);

        const assignments = assignmentsRes.data || [];
        const quizzes = quizzesRes.data || [];
        const stats = statsRes.data || {};

        const pending = assignments.filter(
          (a) => a.status === "Pending",
        ).length;

        const upcoming = quizzes.filter((q) => {
          const dueDate = new Date(q.dueDate);
          return dueDate > new Date() && !q.completed;
        }).length;

        const overallScore = stats.overallScore || 0;
        const notificationCount = pending + upcoming;

        setContextData({
          pendingAssignments: pending,
          upcomingQuizzes: upcoming,
          overallScore,
          notificationCount,
        });
      } catch (error) {
        console.log("Error fetching context data:", error);
      }
    };

    fetchContextData();
    const interval = setInterval(fetchContextData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

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
  }, [setMobileOpen]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: showHeader ? 0 : -120 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 w-full z-50 px-4 md:px-16 pt-4 backdrop-blur-md items-center "
      onClick={(e) => {
        e.stopPropagation();
        setOpenProfile(false);
      }}
    >
      <div className="flex justify-between items-center bg-(--color-primary) rounded-3xl px-6 py-3 shadow-md text-white ">
        {/* LOGO */}
        <Link to="/student" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
            <FiBookOpen className="text-white" size={20} />
          </div>
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
            className={`${location.pathname === "/student" ? "text-(--color-primary-text)" : "text-white"} cursor-pointer hover:text-(--color-primary-text) transition font-semibold`}
          >
            {t("header.home")}
          </button>

          <button
            onClick={() => {
              navigate("/student/courses");
              setMobileOpen(false);
            }}
            className={`${location.pathname === "/student/courses" ? "text-(--color-primary-text)" : "text-white"} cursor-pointer hover:text-(--color-primary-text) transition font-semibold`}
          >
            {t("header.course")}
          </button>

          <button
            onClick={() => {
              navigate("/student/support");
              setMobileOpen(false);
            }}
            className={`${location.pathname === "/student/support" ? "text-(--color-primary-text)" : "text-white"} cursor-pointer hover:text-(--color-primary-text) transition font-semibold`}
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
              className="group-hover:rotate-12 transition-transform"
            >
              <FiBell />
            </motion.div>
            {contextData.notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {contextData.notificationCount > 9
                  ? "9+"
                  : contextData.notificationCount}
              </span>
            )}
          </motion.button>

          {/* Profile */}
          <div className="hidden md:block relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenProfile(!openProfile);
              }}
              className="flex items-center gap-3 bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20 transition cursor-pointer"
              onMouseEnter={() => setOpenProfile(true)}
              onMouseLeave={() => setOpenProfile(false)}
            >
              {user?.photo?.url ? (
                <img
                  src={user?.photo?.url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-white/50"
                />
              ) : (
                <div className="w-8 h-8 bg-white! text-(--color-primary) font-bold rounded-full flex items-center justify-center">
                  {user?.name?.charAt(0)}
                </div>
              )}
              <span className="hidden md:block text-sm font-medium text-white">
                {user?.name?.slice(0, 15)}
              </span>
            </button>

            <AnimatePresence mode="wait">
              {openProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="absolute right-0 mt-3 w-72 bg-(--card-bg) text-(--text-primary) rounded-xl shadow-lg border border-(--border-color)"
                  onMouseEnter={() => {
                    setOpenProfile(true);
                  }}
                  onMouseLeave={() => {
                    closeAll();
                  }}
                >
                  {/* Quick Stats */}
                  {/* <div className="bg-(--bg-surface) p-4 border-b border-(--border-color) rounded-xl">
                    <p className="text-xs text-(--text-muted) mb-3">
                      Quick Overview
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-(--bg-muted) rounded-lg p-2 text-center">
                        <FiFileText className="mx-auto mb-1 text-orange-500" />
                        <p className="text-lg font-bold">
                          {contextData.pendingAssignments}
                        </p>
                        <p className="text-[10px] text-(--text-muted)">
                          Pending
                        </p>
                      </div>
                      <div className="bg-(--bg-muted) rounded-lg p-2 text-center">
                        <FiCheckSquare className="mx-auto mb-1 text-blue-500" />
                        <p className="text-lg font-bold">
                          {contextData.upcomingQuizzes}
                        </p>
                        <p className="text-[10px] text-(--text-muted)">
                          Quizzes
                        </p>
                      </div>
                      <div className="bg-(--bg-muted) rounded-lg p-2 text-center">
                        <FiTrendingUp className="mx-auto mb-1 text-green-500" />
                        <p className="text-lg font-bold">
                          {contextData.overallScore}%
                        </p>
                        <p className="text-[10px] text-(--text-muted)">Score</p>
                      </div>
                    </div>
                  </div> */}

                  {/* Menu Items */}
                  <button
                    onClick={() => {
                      navigate("/student/profile");
                      closeAll();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-(--bg-muted) transition"
                  >
                    {t("header.profile")}
                  </button>

                  <button
                    onClick={() => {
                      navigate("/student/assignments");
                      closeAll();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-(--bg-muted) transition"
                  >
                    {t("header.assignments")}
                  </button>
                  <button
                    onClick={() => {
                      navigate("/student/quizzes");
                      closeAll();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-(--bg-muted) transition"
                  >
                    {t("header.quizzes")}
                  </button>
                  <button
                    onClick={() => {
                      navigate("/student/attendance");
                      closeAll();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-(--bg-muted) transition"
                  >
                    {t("header.attendance")}
                  </button>

                  <button
                    onClick={() => {
                      navigate("/student/progress");
                      closeAll();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-(--bg-muted) transition"
                  >
                    {t("header.progress")}
                  </button>

                  <button
                    onClick={() => {
                      navigate("/student/growth-dashboard");
                      closeAll();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-(--bg-muted) transition"
                  >
                    {t("header.growthDashboard")}
                  </button>

                  <button
                    onClick={() => {
                      navigate("/student/jobs");
                      closeAll();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-(--bg-muted) transition"
                  >
                    {t("header.jobs")}
                  </button>

                  <button
                    onClick={() => {
                      navigate("/student/alumni");
                      closeAll();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-(--bg-muted) transition"
                  >
                    {t("header.alumni")}
                  </button>

                  <div className="border-t border-(--border-color)"></div>

                  <button
                    onClick={toggleTheme}
                    className="w-full text-left px-4 py-2 hover:bg-(--bg-muted) flex gap-2 items-center transition"
                  >
                    {theme === "dark"
                      ? t("header.lightMode")
                      : t("header.darkMode")}
                    <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition ml-auto">
                      {theme === "dark" ? (
                        <FiSun className="text-yellow-400" />
                      ) : (
                        <FiMoon />
                      )}
                    </div>
                  </button>

                  <div className="w-full text-left p-2 px-4 hover:bg-(--bg-muted) flex gap-2 items-center transition">
                    <ChangeLanguage />
                  </div>

                  <div className="border-t border-(--border-color)"></div>

                  <button
                    onClick={() => {
                      logout();
                      closeAll();
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-600 transition"
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
            className="md:hidden mt-3 bg-(--color-primary) rounded-2xl p-4 flex flex-col text-white shadow-lg"
          >
            {/* Mobile Quick Stats */}
            {/* <div className="bg-white/10 rounded-lg p-3 mb-4">
              <p className="text-xs text-white/70 mb-2">Quick Overview</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <FiFileText className="mx-auto mb-1 text-orange-300" />
                  <p className="text-lg font-bold">
                    {contextData.pendingAssignments}
                  </p>
                  <p className="text-[10px] text-white/70">Pending</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <FiCheckSquare className="mx-auto mb-1 text-blue-300" />
                  <p className="text-lg font-bold">
                    {contextData.upcomingQuizzes}
                  </p>
                  <p className="text-[10px] text-white/70">Quizzes</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <FiTrendingUp className="mx-auto mb-1 text-green-300" />
                  <p className="text-lg font-bold">
                    {contextData.overallScore}%
                  </p>
                  <p className="text-[10px] text-white/70">Score</p>
                </div>
              </div>
            </div> */}

            <button
              onClick={() => {
                navigate("/student/courses");
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-white/10 rounded-lg transition"
            >
              {t("header.course")}
            </button>

            <button
              onClick={() => {
                navigate("/student/support");
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-white/10 rounded-lg transition"
            >
              {t("header.support")}
            </button>

            <button
              onClick={() => {
                navigate("/student/profile");
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-white/10 rounded-lg transition"
            >
              {t("header.profile")}
            </button>

            <button
              onClick={() => {
                navigate("/student/assignments");
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-white/10 rounded-lg transition"
            >
              {t("header.assignments")}
            </button>
            <button
              onClick={() => {
                navigate("/student/quizzes");
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-white/10 rounded-lg transition"
            >
              {t("header.quizzes")}
            </button>
            <button
              onClick={() => {
                navigate("/student/attendance");
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-white/10 rounded-lg transition"
            >
              {t("header.attendance")}
            </button>

            <button
              onClick={() => {
                navigate("/student/progress");
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-white/10 rounded-lg transition"
            >
              {t("header.progress")}
            </button>

            <button
              onClick={() => {
                navigate("/student/growth-dashboard");
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-white/10 rounded-lg transition"
            >
              {t("header.growthDashboard")}
            </button>

            <button
              onClick={() => {
                navigate("/student/jobs");
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-white/10 rounded-lg transition"
            >
              {t("header.jobs")}
            </button>

            <button
              onClick={() => {
                navigate("/student/alumni");
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-white/10 rounded-lg transition"
            >
              {t("header.alumni")}
            </button>

            <div className="border-t border-white/20 my-1"></div>

            <button
              onClick={() => {
                toggleTheme();
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-white/10 rounded-lg flex gap-2 items-center transition"
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

            <div className="p-2">
              <ChangeLanguage />
            </div>

            <div className="border-t border-white/20 my-1"></div>

            <button
              onClick={() => {
                logout();
                closeAll();
                setMobileOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-red-500/20 rounded-lg flex items-center gap-2 text-red-200 transition"
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
