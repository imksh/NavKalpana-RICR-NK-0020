import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../config/api";
import useUiStore from "../../store/useUiStore";

const CoursePage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useUiStore();

  const [course, setCourse] = useState(location.state || null);
  const [modules, setModules] = useState([]);
  const [openModule, setOpenModule] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingModules, setLoadingModules] = useState(true);

  /* ================= FETCH COURSE ================= */
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!course) {
          const res = await api.get(`/course/${slug}`);
          setCourse(res.data);
        }
      } catch (error) {
        console.log("Error fetching course:", error);
      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourse();
  }, [slug, location.pathname]);

  /* ================= FETCH MODULES ================= */
  useEffect(() => {
    if (!course?._id) return;

    const fetchModules = async () => {
      try {
        const res = await api.get(`/course/${course._id}/modules`);
        setModules(res.data);

        // auto-open first module
        if (res.data.length > 0) {
          setOpenModule(res.data[0]._id);
        }
      } catch (error) {
        console.log("Error fetching modules:", error);
      } finally {
        setLoadingModules(false);
      }
    };

    fetchModules();
  }, [course?._id]);

  /* ================= TOGGLE LESSON ================= */
  const toggleLesson = (lessonId) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId],
    );
  };

  /* ================= GLOBAL COURSE PROGRESS ================= */
  const totalLessons = modules.reduce(
    (acc, mod) => acc + (mod.lessons?.length || 0),
    0,
  );

  const completedCount = completedLessons.length;

  const overallProgress =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  if (loadingCourse) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        Loading course...
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">
      {/* ================= COURSE HEADER ================= */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-semibold">
          {course?.title?.[lang]}
        </h1>

        <p className="mt-2">{course?.description?.[lang]}</p>

        <p className="text-(--text-secondary) mt-2">
          <strong>Instructor:</strong> {course?.instructor?.name || "N/A"}
        </p>

        {/* PROGRESS */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Course Progress</span>
            <span>{overallProgress}%</span>
          </div>

          <div className="w-full h-3 bg-(--bg-muted) rounded-full">
            <div
              className="h-3 bg-(--color-primary) rounded-full transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 text-sm text-(--text-secondary)">
          Attendance:
          <span className="ml-2 text-(--color-success)">
            {course?.attendancePercent || 0}%
          </span>
        </div>
      </div>

      {/* ================= MODULES ================= */}
      {loadingModules ? (
        <div>Loading modules...</div>
      ) : (
        <div className="space-y-6">
          {modules.map((module) => {
            const lessons = module.lessons || [];

            const moduleCompleted = lessons.filter((l) =>
              completedLessons.includes(l._id),
            ).length;

            const moduleProgress =
              lessons.length > 0
                ? Math.round((moduleCompleted / lessons.length) * 100)
                : 0;

            return (
              <div
                key={module._id}
                className="bg-(--card-bg) border border-(--border-color) rounded-2xl"
              >
                {/* MODULE HEADER */}
                <div
                  className="flex justify-between items-center p-6 cursor-pointer"
                  onClick={() =>
                    setOpenModule(openModule === module._id ? null : module._id)
                  }
                >
                  <div>
                    <h3 className="text-lg font-semibold">
                      {module.title?.[lang]}
                    </h3>
                    <p className="text-sm text-(--text-secondary)">
                      Progress: {moduleProgress}%
                    </p>
                  </div>

                  {openModule === module._id ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  )}
                </div>

                {/* LESSONS */}
                {openModule === module._id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-6 pb-6 space-y-4"
                  >
                    {lessons.length === 0 ? (
                      <p className="text-sm text-(--text-secondary)">
                        No lessons available.
                      </p>
                    ) : (
                      lessons.map((lesson) => (
                        <div
                          key={lesson._id}
                          className="flex justify-between items-center bg-(--bg-muted) p-4 rounded-xl"
                        >
                          {/* Lesson Click */}
                          <div
                            className="cursor-pointer"
                            onClick={() =>
                              navigate(
                                `/student/courses/${slug}/${lesson.slug || lesson._id}`,
                              )
                            }
                          >
                            <h4 className="font-medium">
                              {lesson.title?.[lang] || lesson.title}
                            </h4>
                            <p className="text-xs text-(--text-secondary)">
                              {lesson.difficulty} •{" "}
                              {lesson.estimatedDurationMinutes || 0} min
                            </p>
                          </div>

                          {/* Complete Button */}
                          <button
                            onClick={() => toggleLesson(lesson._id)}
                            className={`px-4 py-2 text-sm rounded-lg ${
                              completedLessons.includes(lesson._id)
                                ? "bg-(--color-success) text-white"
                                : "bg-(--color-primary) text-white"
                            }`}
                          >
                            {completedLessons.includes(lesson._id)
                              ? "Completed"
                              : "Mark Complete"}
                          </button>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CoursePage;
