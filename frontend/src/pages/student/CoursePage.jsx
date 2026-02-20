import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const CoursePage = () => {
  const [openModule, setOpenModule] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const { slug } = useParams();
  const navigate = useNavigate();

  const course = {
    title: "Full Stack Web Development",
    instructor: "Rohit Sharma",
    attendance: 88,
    modules: [
      {
        id: 1,
        title: "React Basics",
        lessons: [
          {
            id: 11,
            slug: "intro-to-react",
            title: "Intro to React",
            difficulty: "Beginner",
            duration: 20,
          },
          {
            id: 12,
            slug: "components-and-props",
            title: "Components & Props",
            difficulty: "Beginner",
            duration: 25,
          },
        ],
      },
      {
        id: 2,
        title: "Node & Express",
        lessons: [
          {
            id: 21,
            title: "Intro to Node",
            difficulty: "Intermediate",
            duration: 30,
          },
          {
            id: 22,
            title: "REST APIs",
            difficulty: "Intermediate",
            duration: 35,
          },
        ],
      },
    ],
  };

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0,
  );

  const progressPercent = Math.round(
    (completedLessons.length / totalLessons) * 100,
  );

  const toggleLesson = (id) => {
    if (completedLessons.includes(id)) {
      setCompletedLessons(completedLessons.filter((l) => l !== id));
    } else {
      setCompletedLessons([...completedLessons, id]);
    }
  };

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">
      {/* COURSE HEADER */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-semibold">{course.title}</h1>

        <p className="text-(--text-secondary) mt-2">
          Instructor: {course.instructor}
        </p>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Course Progress</span>
            <span>{progressPercent}%</span>
          </div>

          <div className="w-full h-3 bg-(--bg-muted) rounded-full">
            <div
              className="h-3 bg-(--color-primary) rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-4 text-sm text-(--text-secondary)">
          Attendance:
          <span className="ml-2 text-(--color-success)">
            {course.attendance}%
          </span>
        </div>

        {/* Demo Button */}
        <button
          onClick={() =>
            setCompletedLessons(
              course.modules.flatMap((m) => m.lessons.map((l) => l.id)),
            )
          }
          className="mt-6 px-6 py-3 rounded-xl bg-(--color-accent) text-white hover:bg-(--color-accent-hover)"
        >
          Mark Course as Complete
        </button>
      </div>

      {/* MODULES */}
      <div className="space-y-6">
        {course.modules.map((module) => {
          const moduleLessons = module.lessons;
          const moduleCompleted = moduleLessons.filter((l) =>
            completedLessons.includes(l.id),
          ).length;

          const moduleProgress = Math.round(
            (moduleCompleted / moduleLessons.length) * 100,
          );

          return (
            <div
              key={module.id}
              className="bg-(--card-bg) border border-(--border-color) rounded-2xl"
            >
              {/* MODULE HEADER */}
              <div
                className="flex justify-between items-center p-6 cursor-pointer"
                onClick={() =>
                  setOpenModule(openModule === module.id ? null : module.id)
                }
              >
                <div>
                  <h3 className="text-lg font-semibold">{module.title}</h3>
                  <p className="text-sm text-(--text-secondary)">
                    Progress: {moduleProgress}%
                  </p>
                </div>

                {openModule === module.id ? <FiChevronUp /> : <FiChevronDown />}
              </div>

              {/* LESSONS */}
              {openModule === module.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-6 pb-6 space-y-4"
                >
                  {moduleLessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      className="flex justify-between items-center bg-(--bg-muted) p-4 rounded-xl w-full"
                      onClick={() =>
                        navigate(`/student/courses/${slug}/${lesson.slug}`)
                      }
                    >
                      <div>
                        <h4 className="font-medium">{lesson.title}</h4>
                        <p className="text-xs text-(--text-secondary)">
                          {lesson.difficulty} • {lesson.duration} min
                        </p>
                      </div>

                      <button
                        onClick={() => toggleLesson(lesson.id)}
                        className={`px-4 py-2 text-sm rounded-lg ${
                          completedLessons.includes(lesson.id)
                            ? "bg-(--color-success) text-white"
                            : "bg-(--color-primary) text-white"
                        }`}
                      >
                        {completedLessons.includes(lesson.id)
                          ? "Completed"
                          : "Mark Complete"}
                      </button>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoursePage;
