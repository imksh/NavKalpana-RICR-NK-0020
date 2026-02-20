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
import ModulePage from "./pages/student/ModulePage";
import AssignmentPage from "./pages/student/AssignmentPage";
import Assignments from "./pages/student/Assignments";
import QuizPage from "./pages/student/QuizPage";
import Quizzes from "./pages/student/Quizzes";
import StudentAttendence from "./pages/student/StudentAttendence";
import Alumni from "./pages/Alumni";
import StudentJobs from "./pages/student/StudentJobs";
import StudentJobPage from "./pages/student/StudentJobPage";
import StudentProgress from "./pages/student/StudentProgress";
import StudentTutor from "./pages/student/StudentTutor";
import FloatingAskAI from "./components/student/FloatingAskAI";
import StudentProfile from "./pages/student/StudentProfile";
import useLenis from './hooks/useLenis';

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
      className="bg-color-gradient overflow-x-hidden min-h-dvh pt-[12dvh]"
      onClick={() => {
        setOpenLang(false);
        setOpenProfile(false);
        setMobileOpen(false);
      }}
    >
      {!user ? (
        <Header />
      ) : user.role === "admin" ? (
        <AdminHeader />
      ) : user.role === "instructor" ? (
        <InstructorHeader />
      ) : (
        <StudentHeader />
      )}

      <ThemeBubble />

      <Routes>
        <Route
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
        />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/unsubscribe-success" element={<UnsubscribeSuccess />} />
        <Route path="/alumini" element={<Alumni />} />
        <Route path="/student/alumini" element={<Alumni />} />

        <Route
          path="/student"
          element={
            user?.role === "student" ? (
              <StudentHome />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/student/profile"
          element={
            user?.role === "student" ? (
              <StudentProfile />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/student/courses"
          element={
            user?.role === "student" ? <MyCourses /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/student/courses/:slug"
          element={
            user?.role === "student" ? <CoursePage /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/student/courses/:course/:module"
          element={
            user?.role === "student" ? <ModulePage /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/student/assignments"
          element={
            user?.role === "student" ? (
              <Assignments />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/student/assignments/:id"
          element={
            user?.role === "student" ? (
              <AssignmentPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/student/quizzes"
          element={
            user?.role === "student" ? <Quizzes /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/student/quizzes/:id"
          element={
            user?.role === "student" ? <QuizPage /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/student/attendance"
          element={
            user?.role === "student" ? (
              <StudentAttendence />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/student/jobs"
          element={
            user?.role === "student" ? (
              <StudentJobs />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/student/jobs/:id"
          element={
            user?.role === "student" ? (
              <StudentJobPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/student/progress"
          element={
            user?.role === "student" ? (
              <StudentProgress />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/student/tutor"
          element={
            user?.role === "student" ? (
              <StudentTutor />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      {user?.role === "student" && <FloatingAskAI />}

      <Footer />

      <Toaster />
    </div>
  );
};

export default App;
