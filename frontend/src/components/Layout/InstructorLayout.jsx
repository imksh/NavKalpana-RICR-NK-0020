import React from "react";
import InstructorHeader from "../instructor/InstructorHeader";
import Footer from "../Footer";

const InstructorLayout = () => {
  return (
    <>
      <InstructorHeader />
      <Outlet />
      <Footer />
    </>
  );
};

export default InstructorLayout;
