import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBookOpen, FiUser, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  // Replace with API call
  useEffect(() => {
    setCourses([
      {
        id: 1,
        slug: "fsd",
        title: "Full Stack Web Development",
        instructor: "Rohit Sharma",
        thumbnail: "https://placehold.co/600x400",
        progress: 65,
        attendance: 88,
        skills: ["React", "Node", "MongoDB"],
      },
      {
        id: 2,
        slug:"dsa",
        title: "Data Structures & Algorithms",
        instructor: "Anjali Verma",
        thumbnail: "https://placehold.co/600x400",
        progress: 40,
        attendance: 92,
        skills: ["Arrays", "Trees", "Graphs"],
      },
    ]);
  }, []);

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold">My Courses</h1>
        <p className="text-(--text-secondary) mt-2">
          Continue your learning journey.
        </p>
      </div>

      {/* COURSES GRID */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ y: -6 }}
            className="bg-(--card-bg) border border-(--border-color) rounded-3xl shadow-sm overflow-hidden"
          >
            {/* THUMBNAIL */}
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-6">
              {/* TITLE */}
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>

              {/* INSTRUCTOR */}
              <div className="flex items-center gap-2 text-(--text-secondary) text-sm mb-4">
                <FiUser size={14} />
                {course.instructor}
              </div>

              {/* PROGRESS BAR */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>

                <div className="w-full h-2 bg-(--bg-muted) rounded-full">
                  <div
                    className="h-2 bg-(--color-primary) rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              {/* ATTENDANCE */}
              <div className="text-sm mb-4 text-(--text-secondary)">
                Attendance:
                <span className="text-(--color-success) font-medium ml-1">
                  {course.attendance}%
                </span>
              </div>

              {/* SKILLS */}
              <div className="flex flex-wrap gap-2 mb-6">
                {course.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 bg-(--bg-muted) rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* CONTINUE BUTTON */}
              <button
                onClick={() => navigate(`/student/courses/${course.slug}`)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-(--color-primary) text-white hover:bg-(--color-primary-hover) transition-all"
              >
                Continue Learning <FiArrowRight />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
