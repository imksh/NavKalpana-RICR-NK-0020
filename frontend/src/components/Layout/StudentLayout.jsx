import StudentHeader from "../student/StudentHeader";
import { Outlet } from "react-router-dom";
import FloatingAskAI from "../student/FloatingAskAI";
import StudentFooter from "../student/StudentFooter";

const StudentLayout = () => {
  return (
    <>
      <StudentHeader />
      <Outlet />
      <FloatingAskAI />
      <StudentFooter />
    </>
  );
};

export default StudentLayout;