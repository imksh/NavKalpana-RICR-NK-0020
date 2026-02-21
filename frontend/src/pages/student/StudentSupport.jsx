import { motion } from "framer-motion";
import {
  FiStar,
  FiCalendar,
  FiMessageCircle,
  FiClock,
  FiPlusCircle,
} from "react-icons/fi";
import { useState } from "react";
import BookSessionModal from "../../components/student/modal/BookSessionModal";
import { useEffect } from "react";
import useUiStore from "../../store/useUiStore";
import api from "../../config/api";

/* ================= DEMO DATA ================= */
const demoCourses = [
  {
    _id: "1",
    title: "Full Stack Development",
    tutors: [
      {
        _id: "t1",
        name: "Rahul Sharma",
        specialization: "MERN Stack",
        bio: "Expert in backend architecture and API scaling.",
        rating: 4.8,
        avatar: "https://i.pravatar.cc/150?img=11",
      },
    ],
  },
  {
    _id: "2",
    title: "Data Structures & Algorithms",
    tutors: [
      {
        _id: "t2",
        name: "Anjali Verma",
        specialization: "Problem Solving",
        bio: "Helps students master coding interviews.",
        rating: 4.9,
        avatar: "https://i.pravatar.cc/150?img=5",
      },
    ],
  },
];

const demoAiTutors = [
  {
    _id: "ai1",
    name: "CodeMentor AI",
    role: "Instant Coding Help",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
];

const StudentSupport = () => {
  const [showBooking, setShowBooking] = useState(false);
  const { lang } = useUiStore();
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get("/student/courses");
        console.log(res.data);
        setCourses(res.data);
      } catch (error) {
        console.log("Error fetching courses:", error);
      }
    };
    fetchCourse();
  }, []);

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16 space-y-20">
      {/* ================= PAGE HEADER ================= */}
      <div>
        <h1 className="text-3xl font-semibold mb-3">Student Support</h1>
        <p className="text-(--text-secondary)">
          Get help from mentors or instantly chat with AI.
        </p>
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl">
          <h3 className="font-semibold mb-2">Ask a Doubt</h3>
          <p className="text-sm text-(--text-secondary) mb-4">
            Submit a doubt and get expert help.
          </p>
          <button className="px-4 py-2 bg-(--color-primary) text-white rounded-xl">
            <FiPlusCircle className="inline mr-2" />
            New Doubt
          </button>
        </div>

        <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl">
          <h3 className="font-semibold mb-2">Book Session</h3>
          <p className="text-sm text-(--text-secondary) mb-4">
            Schedule 1-on-1 mentoring session.
          </p>
          <button
            onClick={() => setShowBooking(true)}
            className="px-4 py-2 bg-(--color-accent) text-white rounded-xl"
          >
            <FiCalendar className="inline mr-2" />
            Schedule Now
          </button>
        </div>

        <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl">
          <h3 className="font-semibold mb-2">My Doubts</h3>
          <p className="text-sm text-(--text-secondary)">
            Track your submitted questions.
          </p>
        </div>
      </section>

      {/* ================= COURSE TUTORS ================= */}
      <section className="space-y-14">
        {courses &&
          courses.map((course) => (
            <div key={course._id}>
              <h2 className="text-2xl font-semibold mb-6">
                {course.title[lang]}
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-(--card-bg) border border-(--border-color) p-6 rounded-3xl flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={course.instructor.photo.url}
                      alt={course.instructor.name}
                      className="w-16 h-16 rounded-full object-center object-cover border-3 border-(--color-primary)"
                    />
                    <div>
                      <h3 className="font-semibold">
                        {course.instructor.name}
                      </h3>
                      <p className="text-sm text-(--text-secondary) mb-6">
                        {course.instructor.bio ||
                          `Expert in ${course.title[lang]}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {course.instructor.skillsAcquired?.map((skill) => (
                      <span
                        key={skill}
                        className="bg-(--bg-main) text-white text-xs px-5 py-2 rounded-full mr-1 "
                      >
                        {skill}
                      </span>
                    )) || (
                      <span className="text-(--color-primary)">
                        {course.instructor.specialization ||
                          "Course Instructor"}
                      </span>
                    )}
                  </div>

                  {/* <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-1 text-(--color-warning)">
                      <FiStar />
                      {course.instructor.rating}
                    </div>

                    <span className="text-xs text-(--color-success)">
                      ● Online
                    </span>
                  </div> */}

                  <div className="mt-auto space-y-3">
                    <button className="w-full py-2 bg-(--color-primary) text-white rounded-xl">
                      <FiMessageCircle className="inline mr-2" />
                      Ask Doubt
                    </button>

                    <button
                      onClick={() => setShowBooking(true)}
                      className="w-full py-2 border border-(--border-color) rounded-xl hover:bg-(--bg-muted)"
                    >
                      <FiCalendar className="inline mr-2" />
                      Book Session
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
      </section>

      {/* ================= UPCOMING SESSIONS ================= */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">📅 Upcoming Sessions</h2>

        <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl text-(--text-secondary)">
          No sessions booked yet.
        </div>
      </section>

      {/* ================= AI TUTORS ================= */}
      <section>
        <h2 className="text-2xl font-semibold mb-8">🤖 AI Mentors</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoAiTutors.map((ai) => (
            <motion.div
              key={ai._id}
              whileHover={{ scale: 1.03 }}
              className="bg-(--card-bg) border border-(--border-color) p-6 rounded-3xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={ai.avatar}
                  alt={ai.name}
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{ai.name}</h3>
                  <p className="text-sm text-(--text-secondary)">{ai.role}</p>
                </div>
              </div>

              <button className="w-full py-2 bg-(--color-accent) text-white rounded-xl">
                Start AI Chat
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= BOOK SESSION MODAL ================= */}
      {showBooking && (
        <BookSessionModal
          isOpen={showBooking}
          onClose={() => setShowBooking(false)}
          onSubmit={(data) => console.log(data)}
        />
      )}
    </div>
  );
};

export default StudentSupport;
