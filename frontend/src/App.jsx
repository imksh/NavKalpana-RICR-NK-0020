import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import useUiStore from "./store/useUiStore";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

import Loading from "./components/Loading";
import { Scroll } from "./components/Scrool";
import ThemeBubble from "./components/ThemeBubble";
import PwaInstallPrompt from "./components/PwaInstallPrompt";

import api from "./config/api";
import i18n from "./config/i18n";
import useLenis from "./hooks/useLenis";
import usePushStore from "./store/usePushStore";

const Landing = lazy(() => import("./pages/Landing"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const UnsubscribeSuccess = lazy(() => import("./pages/UnsubscribeSuccess"));
const Courses = lazy(() => import("./pages/Courses"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Alumni = lazy(() => import("./pages/Alumni"));
const NotFound = lazy(() => import("./pages/NotFound"));

const StudentHome = lazy(() => import("./pages/student/StudentHome"));
const StudentProfile = lazy(() => import("./pages/student/StudentProfile"));
const MyCourses = lazy(() => import("./pages/student/MyCourses"));
const StudentSupport = lazy(() => import("./pages/student/StudentSupport"));
const StudentNotifications = lazy(
  () => import("./pages/student/StudentNotifications"),
);
const CoursePage = lazy(() => import("./pages/student/CoursePage"));
const LessonPage = lazy(() => import("./pages/student/LessonPage"));
const Assignments = lazy(() => import("./pages/student/Assignments"));
const AssignmentPage = lazy(() => import("./pages/student/AssignmentPage"));
const Quizzes = lazy(() => import("./pages/student/Quizzes"));
const QuizPage = lazy(() => import("./pages/student/QuizPage"));
const StudentAttendence = lazy(
  () => import("./pages/student/StudentAttendence"),
);
const StudentJobs = lazy(() => import("./pages/student/StudentJobs"));
const StudentJobPage = lazy(() => import("./pages/student/StudentJobPage"));
const StudentProgress = lazy(() => import("./pages/student/StudentProgress"));
const GrowthDashboard = lazy(() => import("./pages/student/GrowthDashboard"));

const AdminHome = lazy(() => import("./pages/admin/AdminHome"));
const InstructorHome = lazy(() => import("./pages/instructor/InstructorHome"));

const ProtectedRoute = lazy(() => import("./components/Layout/ProtectedRoute"));
const AdminLayout = lazy(() => import("./components/Layout/AdminLayout"));
const InstructorLayout = lazy(
  () => import("./components/Layout/InstructorLayout"),
);
const PublicLayout = lazy(() => import("./components/Layout/PublicLayout"));
const StudentLayout = lazy(() => import("./components/Layout/StudentLayout"));

const App = () => {
  const { user, checkAuth, isCheckingAuth } = useAuthStore();
  const { setOpenLang, setOpenProfile, setMobileOpen, setShowSearch } =
    useUiStore();
  const theme = useThemeStore((state) => state.theme);
  const { subscribeUserToPush } = usePushStore();
  useLenis();

  /* ============================= */
  /*        INITIAL LOAD           */
  /* ============================= */

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /* ============================= */
  /*        TRACK VISITOR          */
  /* ============================= */

  useEffect(() => {
    api.post("/public/track");
  }, []);

  /* ============================= */
  /*        APPLY THEME            */
  /* ============================= */

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  /* ============================= */
  /*        LANGUAGE INIT          */
  /* ============================= */

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    const initPush = async () => {
      if (!user || user.role !== "student") return;
      if (!("Notification" in window) || !("serviceWorker" in navigator)) {
        return;
      }

      let permission = Notification.permission;

      if (permission === "default") {
        permission = await Notification.requestPermission();
      }

      if (permission !== "granted") {
        console.log("Notification permission denied.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const existingSubscription =
        await registration.pushManager.getSubscription();

      if (!existingSubscription) {
        await subscribeUserToPush();
      }
    };

    initPush();
  }, [user, subscribeUserToPush]);

  if (isCheckingAuth) return <Loading />;

  /* ============================= */
  /*        ROLE-BASED HEADER      */
  /* ============================= */

  return (
    <div
      className="overflow-x-hidden min-h-dvh pt-[12dvh] hide-scrollbar"
      onClick={() => {
        setOpenLang(false);
        setOpenProfile(false);
        setMobileOpen(false);
        setShowSearch(false);
      }}
    >
      <Scroll />

      <ThemeBubble />

      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route
              path="/"
              element={
                !user ? (
                  <Landing />
                ) : user.role === "admin" ? (
                  <Navigate to="/admin" />
                ) : user.role === "instructor" ? (
                  <Navigate to="/instructor" />
                ) : (
                  <Navigate to="/student" />
                )
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" /> : <Register />}
            />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route
              path="/unsubscribe-success"
              element={<UnsubscribeSuccess />}
            />
            <Route path="/alumini" element={<Alumni />} />
          </Route>

          <Route
            element={
              <ProtectedRoute role="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/student" element={<StudentHome />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/courses" element={<MyCourses />} />
            <Route path="/student/support" element={<StudentSupport />} />
            <Route path="/student/alumni" element={<Alumni />} />
            <Route path="/student/contact" element={<Contact />} />
            <Route
              path="/student/notifications"
              element={<StudentNotifications />}
            />
            <Route path="/student/courses/:slug" element={<CoursePage />} />

            <Route
              path="/student/courses/:course/:slug"
              element={<LessonPage />}
            />

            <Route path="/student/assignments" element={<Assignments />} />

            <Route
              path="/student/assignments/:id"
              element={<AssignmentPage />}
            />

            <Route path="/student/quizzes" element={<Quizzes />} />

            <Route path="/student/quizzes/:id" element={<QuizPage />} />

            <Route path="/student/attendance" element={<StudentAttendence />} />

            <Route path="/student/jobs" element={<StudentJobs />} />

            <Route path="/student/jobs/:id" element={<StudentJobPage />} />

            <Route path="/student/progress" element={<StudentProgress />} />
            <Route
              path="/student/growth-dashboard"
              element={<GrowthDashboard />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminHome />} />
          </Route>

          <Route
            element={
              <ProtectedRoute role="instructor">
                <InstructorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/instructor" element={<InstructorHome />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <PwaInstallPrompt />
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
