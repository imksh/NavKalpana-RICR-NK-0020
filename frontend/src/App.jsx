import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import useUiStore from "./store/useUiStore";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

//Components
import Header from "./components/Header";
import AdminHeader from "./components/admin/AdminHeader";
import InstructorHeader from "./components/instructor/InstructorHeader";
import StudentHeader from "./components/student/StudentHeader";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import { Scroll } from "./components/Scrool";
import ThemeBubble from "./components/ThemeBubble";

//Pages
import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import TermsAndConditions from "./pages/TermsAndConditions";
import UnsubscribeSuccess from "./pages/UnsubscribeSuccess";
import InstructorHome from "./pages/instructor/InstructorHome";
import StudentHome from "./pages/student/StudentHome";

import api from "./config/api";
import i18n from "./config/i18n";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminHome from "./pages/admin/AdminHome";
import MyCourses from "./pages/student/MyCourses";
import CoursePage from "./pages/student/CoursePage";
import AssignmentPage from "./pages/student/AssignmentPage";
import Assignments from "./pages/student/Assignments";
import QuizPage from "./pages/student/QuizPage";
import Quizzes from "./pages/student/Quizzes";
import StudentAttendence from "./pages/student/StudentAttendence";
import Alumni from "./pages/Alumni";
import StudentJobs from "./pages/student/StudentJobs";
import StudentJobPage from "./pages/student/StudentJobPage";
import StudentProgress from "./pages/student/StudentProgress";
import StudentSupport from "./pages/student/StudentSupport";
import FloatingAskAI from "./components/student/FloatingAskAI";
import StudentProfile from "./pages/student/StudentProfile";
import useLenis from "./hooks/useLenis";
import LessonPage from "./pages/student/LessonPage";
import StudentNotifications from "./pages/student/StudentNotifications";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import AdminLayout from "./components/Layout/AdminLayout";
import InstructorLayout from "./components/Layout/InstructorLayout";
import PublicLayout from "./components/Layout/PublicLayout";
import StudentLayout from "./components/Layout/StudentLayout";
import Courses from "./pages/Courses";

const App = () => {
  const { user, checkAuth, isCheckingAuth } = useAuthStore();
  const { setOpenLang, setOpenProfile, setMobileOpen } = useUiStore();
  const theme = useThemeStore((state) => state.theme);
  useLenis();

  /* ============================= */
  /*        INITIAL LOAD           */
  /* ============================= */

  useEffect(() => {
    checkAuth();
  }, []);

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
      }}
    >
      <Scroll />

      {/* {!user ? (
        <Header />
      ) : user.role === "admin" ? (
        <AdminHeader />
      ) : user.role === "instructor" ? (
        <InstructorHeader />
      ) : (
        <StudentHeader />
      )} */}

      {/* <Route
          path="/"
          element={
            !user ? (
              <Landing />
            ) : user.role === "admin" ? (
              <AdminHome />
            ) : user.role === "instructor" ? (
              <InstructorHome />
            ) : (
              <Navigate to="/student" />
            )
          }
        /> */}

      <ThemeBubble />

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
          <Route path="/unsubscribe-success" element={<UnsubscribeSuccess />} />
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

          <Route path="/student/assignments/:id" element={<AssignmentPage />} />

          <Route path="/student/quizzes" element={<Quizzes />} />

          <Route path="/student/quizzes/:id" element={<QuizPage />} />

          <Route path="/student/attendance" element={<StudentAttendence />} />

          <Route path="/student/jobs" element={<StudentJobs />} />

          <Route path="/student/jobs/:id" element={<StudentJobPage />} />

          <Route path="/student/progress" element={<StudentProgress />} />
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
      </Routes>

      <Toaster position="top-right" />
    </div>
  );
};

export default App;
