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
import i18n from "./utils/i18n";
import Register from "./pages/Register";
import Login from "./pages/Login";

const App = () => {
  const { user, checkAuth, isCheckingAuth } = useAuthStore();
  const { setShowHeaderMenu, setOpenLang, setOpenProfile } = useUiStore();
  const theme = useThemeStore((state) => state.theme);

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

  const renderHeader = () => {
    if (!user) return <Header />;

    switch (user.role) {
      case "admin":
        return <AdminHeader />;

      case "instructor":
        return <InstructorHeader />;

      case "student":
        return <StudentHeader />;

      default:
        return <Header />;
    }
  };

  return (
    <div
      className="bg-color-gradient overflow-x-hidden min-h-dvh pt-[12dvh]"
      onClick={() => {
        setShowHeaderMenu(false);
        setOpenLang(false);
        setOpenProfile(false);
      }}
    >
      {renderHeader()}

      <ThemeBubble />

      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <Landing />
            ) : user.role === "instructor" ? (
              <InstructorHome />
            ) : (
              <StudentHome />
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
      </Routes>

      <Footer />

      <Toaster />
    </div>
  );
};

export default App;
