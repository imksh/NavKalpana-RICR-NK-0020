import StudentHeader from "../student/StudentHeader";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiBookOpen } from "react-icons/fi";
import toast from "react-hot-toast";
import FloatingAskAI from "../student/FloatingAskAI";
import StudentFooter from "../student/StudentFooter";
import LoadingWave from "../LoadingWave";
import api from "../../config/api";

const StudentLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasEnrolledCourse, setHasEnrolledCourse] = useState(true);

  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const res = await api.get("/student/courses");
        const courses = Array.isArray(res.data) ? res.data : [];
        setHasEnrolledCourse(courses.length > 0);
      } catch {
        setHasEnrolledCourse(true);
      } finally {
        setLoading(false);
      }
    };

    checkEnrollment();
  }, []);

  if (loading) {
    return (
      <>
        <StudentHeader />
        <div className="min-h-[70dvh] flex items-center justify-center">
          <LoadingWave size="w-40 h-40" />
        </div>
        <StudentFooter />
      </>
    );
  }

  if (!hasEnrolledCourse) {
    return (
      <>
        <StudentHeader />
        <main className="min-h-[70dvh] px-4 md:px-10 lg:px-16 py-10 md:py-14 bg-(--bg-main)">
          <section className="max-w-3xl mx-auto rounded-3xl border border-(--border-color) bg-(--card-bg) shadow-sm p-7 md:p-10">
            <div className="w-14 h-14 rounded-2xl bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center mb-5">
              <FiBookOpen size={28} />
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-(--text-primary)">
              You are currently not enrolled in any course
            </h1>

            <p className="mt-3 text-(--text-secondary) text-sm md:text-base leading-relaxed">
              Please contact your admin to get enrolled in a course and unlock
              your student dashboard modules.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/student/contact")}
                className="px-5 py-2.5 rounded-xl bg-(--color-primary) text-white font-medium hover:bg-(--color-primary-hover) transition"
              >
                Contact Admin
              </button>
              <button
                onClick={() =>
                  toast("Please contact admin to enroll you into a course")
                }
                className="px-5 py-2.5 rounded-xl border border-(--border-color) font-medium text-(--text-primary) hover:bg-(--bg-muted) transition inline-flex items-center gap-2"
              >
                <FiAlertCircle size={16} />
                Need Help
              </button>
            </div>
          </section>
        </main>
        <StudentFooter />
      </>
    );
  }

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
