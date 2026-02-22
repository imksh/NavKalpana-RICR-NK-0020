import Footer from "../Footer";
import { Outlet } from "react-router-dom";
import FloatingAskAI from "../student/FloatingAskAI";
import Header from "../Header";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect } from "react";

const PublicLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default PublicLayout;
