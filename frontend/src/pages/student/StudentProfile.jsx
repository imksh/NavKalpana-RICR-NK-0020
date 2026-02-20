import { motion } from "framer-motion";
import {
  FiEdit2,
  FiMail,
  FiAward,
  FiBookOpen,
  FiTrendingUp,
} from "react-icons/fi";
import { useAuthStore } from "../../store/useAuthStore";
import { useStudentStore } from "../../store/useStudentStore";
import useUiStore from "../../store/useUiStore";
import { useThemeStore } from "../../store/useThemeStore";

const StudentProfile = () => {
  const { user } = useAuthStore();
  const { stats } = useStudentStore();
  const { lang } = useUiStore();
  const { theme } = useThemeStore();

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">
      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-(--card-bg) border border-(--border-color) rounded-3xl p-8 shadow-sm mb-12"
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={user.photo.url}
            alt={user.name}
            className="w-28 h-28 rounded-full border-4 border-(--color-primary) object-cover object-center"
          />

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-semibold mb-2">{user.name}</h1>

            <div className="flex items-center justify-center md:justify-start gap-2 text-(--text-secondary)">
              <FiMail />
              {user.email}
            </div>

            <p className="mt-2 text-(--text-muted)">{user.role}</p>
          </div>

          <button className="flex items-center gap-2 px-5 py-2 bg-(--color-primary) text-white rounded-xl hover:opacity-90">
            <FiEdit2 />
            Edit Profile
          </button>
        </div>
      </motion.div>

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl text-center">
          <FiTrendingUp
            className="mx-auto mb-2 text-(--color-warning)"
            size={22}
          />
          <h3 className="text-xl font-semibold">{stats.streak} 🔥</h3>
          <p className="text-sm text-(--text-secondary)">Current Streak</p>
        </div>

        <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl text-center">
          <FiAward className="mx-auto mb-2 text-(--color-success)" size={22} />
          <h3 className="text-xl font-semibold">{stats.avgQuizScore}%</h3>
          <p className="text-sm text-(--text-secondary)">Avg Quiz Score</p>
        </div>

        <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl text-center">
          <FiBookOpen
            className="mx-auto mb-2 text-(--color-primary)"
            size={22}
          />
          <h3 className="text-xl font-semibold">{stats.avgAssignmentMarks}%</h3>
          <p className="text-sm text-(--text-secondary)">Avg Assignment</p>
        </div>

        <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl text-center">
          <FiAward className="mx-auto mb-2 text-(--color-accent)" size={22} />
          <h3 className="text-xl font-semibold">{stats.longestStreak}</h3>
          <p className="text-sm text-(--text-secondary)">Longest Streak</p>
        </div>
      </div>

      {/* ================= SKILLS ================= */}
      <div className="bg-(--card-bg) border border-(--border-color) p-8 rounded-3xl mb-12">
        <h2 className="text-xl font-semibold mb-6">Skills Acquired</h2>

        <div className="flex flex-wrap gap-3">
          {user.skillsAcquired.map((skill, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-(--bg-muted) rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* ================= ENROLLED COURSES ================= */}
      <div className="bg-(--card-bg) border border-(--border-color) p-8 rounded-3xl mb-12">
        <h2 className="text-xl font-semibold mb-6">Enrolled Courses</h2>

        <div className="space-y-4">
          {stats.enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="p-4 border border-(--border-color) rounded-xl hover:bg-(--bg-muted) transition"
            >
              {course.title[lang]}
            </div>
          ))}
        </div>
      </div>

      {/* ================= PREFERENCES ================= */}
      <div className="bg-(--card-bg) border border-(--border-color) p-8 rounded-3xl">
        <h2 className="text-xl font-semibold mb-6">Preferences</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-(--text-muted)">Language</p>
            <p className="font-medium">{user.preferredLanguage || lang}</p>
          </div>

          <div>
            <p className="text-sm text-(--text-muted)">Theme</p>
            <p className="font-medium">{user.themePreference || theme}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
