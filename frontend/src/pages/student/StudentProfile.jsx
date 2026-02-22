import { motion } from "framer-motion";
import {
  FiEdit2,
  FiMail,
  FiAward,
  FiBookOpen,
  FiTrendingUp,
  FiCheckCircle,
  FiTarget,
  FiClock,
  FiActivity,
} from "react-icons/fi";
import { useAuthStore } from "../../store/useAuthStore";
import { useStudentStore } from "../../store/useStudentStore";
import useUiStore from "../../store/useUiStore";
import { useThemeStore } from "../../store/useThemeStore";
import { useState, useEffect } from "react";
import StudentEditProfileModal from "../../components/student/modal/StudentEditProfileModal";
import ChangePasswordModal from "../../components/modals/ChangePasswordModal";
import api from "../../config/api";
import { useTranslation } from "react-i18next";

const StudentProfile = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { stats } = useStudentStore();
  const { lang } = useUiStore();
  const { theme } = useThemeStore();
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  /* ================= ADDITIONAL DATA ================= */
  const [progressData, setProgressData] = useState({
    overallProgress: 0,
    courseProgress: [],
    avgQuizScore: 0,
    avgAssignmentScore: 0,
    insight: "",
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const [progressRes, assignmentsRes, quizzesRes] = await Promise.all([
          api.get("/student/progress").catch(() => ({ data: {} })),
          api.get("/student/assignments").catch(() => ({ data: [] })),
          api.get("/student/quizzes").catch(() => ({ data: [] })),
        ]);

        setProgressData(progressRes.data || {});

        const allAssignments = assignmentsRes.data || [];
        const allQuizzes = quizzesRes.data || [];

        // Build recent activity from assignments and quizzes
        const activity = [
          ...allAssignments.slice(0, 3).map((a) => ({
            type: "assignment",
            title: a.title,
            status: a.status,
            date: a.submittedAt || a.deadline,
          })),
          ...allQuizzes.slice(0, 3).map((q) => ({
            type: "quiz",
            title: q.title,
            status: q.completed ? "Completed" : "Pending",
            date: q.updatedAt || q.dueDate,
          })),
        ]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setRecentActivity(activity);
      } catch (error) {
        console.log("Error fetching additional data:", error);
      }
    };

    fetchAdditionalData();
  }, []);

  const getActivityTypeLabel = (type) => {
    if (type === "assignment") return t("studentProfile.activity.assignment");
    if (type === "quiz") return t("studentProfile.activity.quiz");
    return type;
  };

  const getActivityStatusLabel = (status) => {
    if (status === "Completed") return t("studentProfile.activity.completed");
    if (status === "Pending") return t("studentProfile.activity.pending");
    if (status === "Submitted") return t("studentProfile.activity.submitted");
    if (status === "Evaluated") return t("studentProfile.activity.evaluated");
    return status;
  };

  return (
    <>
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

              <p className="mt-2 text-(--text-muted) capitalize">{user.role}</p>
              <p className="mt-2 text-(--text-muted) text-sm">
                {user.bio || t("studentProfile.defaultBio")}
              </p>
            </div>

            <button
              onClick={() => setIsEditProfileModalOpen((prev) => !prev)}
              className="flex items-center gap-2 px-5 py-2 bg-(--color-primary) text-white rounded-xl hover:opacity-90"
            >
              <FiEdit2 />
              {t("studentProfile.editProfile")}
            </button>
          </div>
        </motion.div>

        {/* ================= STATS ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <FiTrendingUp className="text-(--color-warning)" size={24} />
              <span className="text-2xl font-bold">{stats.streak || 0} 🔥</span>
            </div>
            <p className="text-sm text-(--text-secondary)">
              {t("studentProfile.currentStreak")}
            </p>
            <p className="text-xs text-(--text-muted) mt-1">
              {t("studentProfile.bestDays", {
                days: stats.longestStreak || 0,
              })}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <FiAward className="text-(--color-success)" size={24} />
              <span className="text-2xl font-bold">
                {stats.avgQuizScore || 0}%
              </span>
            </div>
            <p className="text-sm text-(--text-secondary)">
              {t("studentProfile.avgQuiz")}
            </p>
            <div className="mt-2 bg-(--bg-muted) rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${stats.avgQuizScore || 0}%` }}
              ></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <FiBookOpen className="text-(--color-primary)" size={24} />
              <span className="text-2xl font-bold">
                {stats.avgAssignmentMarks || 0}%
              </span>
            </div>
            <p className="text-sm text-(--text-secondary)">
              {t("studentProfile.avgAssignment")}
            </p>
            <div className="mt-2 bg-(--bg-muted) rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${stats.avgAssignmentMarks || 0}%` }}
              ></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <FiTarget className="text-(--color-accent)" size={24} />
              <span className="text-2xl font-bold">
                {stats.overallScore || 0}%
              </span>
            </div>
            <p className="text-sm text-(--text-secondary)">
              {t("studentProfile.overallScore")}
            </p>
            <div className="mt-2 bg-(--bg-muted) rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${stats.overallScore || 0}%` }}
              ></div>
            </div>
          </motion.div>
        </div>

        {/* ================= ACHIEVEMENTS & INSIGHTS ================= */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Achievements */}
          <div className="bg-(--card-bg) border border-(--border-color) p-8 rounded-3xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiAward className="text-(--color-warning)" />
              {t("studentProfile.achievements.title")}
            </h2>

            <div className="space-y-4">
              {stats.streak >= 7 && (
                <div className="flex items-center gap-3 p-3 bg-(--bg-muted) rounded-xl">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <p className="font-medium">
                      {t("studentProfile.achievements.weekWarriorTitle")}
                    </p>
                    <p className="text-xs text-(--text-muted)">
                      {t("studentProfile.achievements.weekWarrior")}
                    </p>
                  </div>
                </div>
              )}

              {stats.avgQuizScore >= 80 && (
                <div className="flex items-center gap-3 p-3 bg-(--bg-muted) rounded-xl">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="font-medium">
                      {t("studentProfile.achievements.quizMasterTitle")}
                    </p>
                    <p className="text-xs text-(--text-muted)">
                      {t("studentProfile.achievements.quizMaster")}
                    </p>
                  </div>
                </div>
              )}

              {stats.submittedAssignments >= 10 && (
                <div className="flex items-center gap-3 p-3 bg-(--bg-muted) rounded-xl">
                  <span className="text-2xl">📚</span>
                  <div>
                    <p className="font-medium">
                      {t("studentProfile.achievements.assignmentProTitle")}
                    </p>
                    <p className="text-xs text-(--text-muted)">
                      {t("studentProfile.achievements.assignmentPro")}
                    </p>
                  </div>
                </div>
              )}

              {stats.attendancePercent >= 90 && (
                <div className="flex items-center gap-3 p-3 bg-(--bg-muted) rounded-xl">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="font-medium">
                      {t("studentProfile.achievements.perfectAttendanceTitle")}
                    </p>
                    <p className="text-xs text-(--text-muted)">
                      {t("studentProfile.achievements.perfectAttendance")}
                    </p>
                  </div>
                </div>
              )}

              {!stats.streak &&
                !stats.avgQuizScore &&
                !stats.submittedAssignments && (
                  <p className="text-(--text-muted) text-center py-4">
                    {t("studentProfile.achievements.keepLearning")}
                  </p>
                )}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-(--card-bg) border border-(--border-color) p-8 rounded-3xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiActivity className="text-(--color-primary)" />
              {t("studentProfile.performanceInsights")}
            </h2>

            <div className="space-y-4">
              {progressData.insight && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <p className="text-sm text-(--text-primary)">
                    💡 {progressData.insight}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-(--bg-muted) rounded-xl">
                  <p className="text-xs text-(--text-muted) mb-1">
                    {t("studentProfile.attendance")}
                  </p>
                  <p className="text-lg font-bold">
                    {stats.attendancePercent || 0}%
                  </p>
                </div>

                <div className="p-3 bg-(--bg-muted) rounded-xl">
                  <p className="text-xs text-(--text-muted) mb-1">
                    {t("studentProfile.courseProgress")}
                  </p>
                  <p className="text-lg font-bold">
                    {stats.courseCompletionPercent || 0}%
                  </p>
                </div>

                <div className="p-3 bg-(--bg-muted) rounded-xl">
                  <p className="text-xs text-(--text-muted) mb-1">
                    {t("studentProfile.assignments")}
                  </p>
                  <p className="text-lg font-bold">
                    {stats.submittedAssignments || 0}/
                    {stats.totalAssignments || 0}
                  </p>
                </div>

                <div className="p-3 bg-(--bg-muted) rounded-xl">
                  <p className="text-xs text-(--text-muted) mb-1">
                    {t("studentProfile.quizzes")}
                  </p>
                  <p className="text-lg font-bold">
                    {stats.attemptedQuizzes || 0}/{stats.totalQuizzes || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RECENT ACTIVITY ================= */}
        <div className="bg-(--card-bg) border border-(--border-color) p-8 rounded-3xl mb-12">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FiClock className="text-(--color-success)" />
            {t("studentProfile.recentActivity")}
          </h2>

          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 hover:bg-(--bg-muted) rounded-xl transition"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === "assignment"
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : "bg-green-100 dark:bg-green-900/30"
                    }`}
                  >
                    {activity.type === "assignment" ? (
                      <FiBookOpen
                        className={
                          activity.type === "assignment"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-green-600 dark:text-green-400"
                        }
                      />
                    ) : (
                      <FiCheckCircle className="text-green-600 dark:text-green-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-xs text-(--text-muted)">
                      {getActivityTypeLabel(activity.type)} •{" "}
                      {getActivityStatusLabel(activity.status)}
                    </p>
                  </div>

                  <p className="text-xs text-(--text-muted)">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-(--text-muted) text-center py-8">
              {t("studentProfile.noRecentActivity")}
            </p>
          )}
        </div>

        {/* ================= SKILLS ================= */}
        <div className="bg-(--card-bg) border border-(--border-color) p-8 rounded-3xl mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {t("studentProfile.skillsAcquired")}
            </h2>
            <div className="text-sm text-(--text-muted)">
              {user.skillsAcquired?.length || 0} / {stats.totalSkills || 0}{" "}
              {t("studentProfile.skills")}
            </div>
          </div>

          {stats.totalSkills > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-(--text-secondary)">
                  {t("studentProfile.progress")}
                </span>
                <span className="font-medium">
                  {Math.round(
                    ((user.skillsAcquired?.length || 0) /
                      (stats.totalSkills || 1)) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div className="bg-(--bg-muted) rounded-full h-3">
                <div
                  className="bg-linear-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      ((user.skillsAcquired?.length || 0) /
                        (stats.totalSkills || 1)) *
                        100,
                      100,
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {user.skillsAcquired?.length > 0 ? (
              user.skillsAcquired.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-2 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </motion.span>
              ))
            ) : (
              <p className="text-(--text-muted) py-4">
                {t("studentProfile.noSkills")}
              </p>
            )}
          </div>
        </div>

        {/* ================= ENROLLED COURSES ================= */}
        <div className="bg-(--card-bg) border border-(--border-color) p-8 rounded-3xl mb-12">
          <h2 className="text-xl font-semibold mb-6">
            {t("studentProfile.enrolledCourses")}
          </h2>

          {stats.enrolledCourses?.length > 0 ? (
            <div className="space-y-4">
              {stats.enrolledCourses.map((course, index) => {
                const courseProgressData = progressData.courseProgress?.find(
                  (c) => c._id === course._id,
                );
                const progress = courseProgressData?.progress || 0;

                return (
                  <motion.div
                    key={course._id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 border border-(--border-color) rounded-xl hover:bg-(--bg-muted) transition group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg group-hover:text-(--color-primary) transition">
                        {course.title?.[lang] || course.title}
                      </h3>
                      <span className="text-sm font-medium text-(--color-primary)">
                        {progress}%
                      </span>
                    </div>

                    <div className="bg-(--bg-muted) rounded-full h-2 mb-2">
                      <div
                        className="bg-(--color-primary) h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-(--text-muted)">
                      <span className="flex items-center gap-1">
                        <FiBookOpen size={12} />
                        {t("studentProfile.lessons", {
                          count: course.totalLessons || 0,
                        })}
                      </span>
                      {course.duration && (
                        <span className="flex items-center gap-1">
                          <FiClock size={12} />
                          {course.duration}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <p className="text-(--text-muted) text-center py-8">
              {t("studentProfile.notEnrolled")}
            </p>
          )}
        </div>

        {/* ================= SECURITY ================= */}
        <div className="bg-(--card-bg) border border-(--border-color) p-8 rounded-3xl mb-12">
          <h2 className="text-xl font-semibold mb-6">
            {t("studentProfile.security")}
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t("studentProfile.password")}</p>
              <p className="text-sm text-(--text-muted)">
                {t("studentProfile.updatePassword")}
              </p>
            </div>

            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="px-6 py-2 bg-(--color-primary) text-white rounded-xl hover:opacity-90"
            >
              {t("studentProfile.changePassword")}
            </button>
          </div>
        </div>

        {/* ================= PREFERENCES ================= */}
        <div className="bg-(--card-bg) border border-(--border-color) p-8 rounded-3xl">
          <h2 className="text-xl font-semibold mb-6">
            {t("studentProfile.preferences")}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-(--text-muted)">
                {t("studentProfile.language")}
              </p>
              <p className="font-medium">
                {user.preferredLanguage
                  ? user.preferredLanguage === "en"
                    ? t("studentProfile.english")
                    : t("studentProfile.hindi")
                  : lang === "en"
                    ? t("studentProfile.hindi")
                    : t("studentProfile.english")}
              </p>
            </div>

            <div>
              <p className="text-sm text-(--text-muted)">
                {t("studentProfile.theme")}
              </p>
              <p className="font-medium capitalize">
                {user.themePreference || theme}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {isEditProfileModalOpen && (
        <StudentEditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
        />
      )}

      {isChangePasswordOpen && (
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      )}
    </>
  );
};

export default StudentProfile;
