import {
  FiCalendar,
  FiMessageCircle,
  FiClock,
  FiPlusCircle,
  FiArrowUpRight,
  FiBookOpen,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiTrendingUp,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BookSessionModal from "../../components/student/modal/BookSessionModal";
import useUiStore from "../../store/useUiStore";
import api from "../../config/api";
import AskDoubtModal from "../../components/student/modal/AskDoubtModel";
import StudentSupportTrackerModal from "../../components/student/modal/StudentSupportTrackerModal";
import { useTranslation } from "react-i18next";

/* ================= DEMO DATA ================= */

const demoAiTutors = [
  {
    _id: "ai1",
    name: "CodeMentor AI",
    role: "Instant Coding Help",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
];

const StudentSupport = () => {
  const { t } = useTranslation();
  const [showBooking, setShowBooking] = useState(false);
  const [showAskDoubt, setShowAskDoubt] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const { lang } = useUiStore();
  const [courses, setCourses] = useState(null);
  const [showTracker, setShowTracker] = useState(false);

  /* ================= SUPPORT DATA ================= */
  const [doubts, setDoubts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesRes, doubtsRes, sessionsRes] = await Promise.all([
          api.get("/student/courses"),
          api.get("/student/doubts").catch(() => ({ data: [] })),
          api.get("/student/sessions").catch(() => ({ data: [] })),
        ]);

        setCourses(coursesRes.data);
        setDoubts(doubtsRes.data || []);
        setSessions(sessionsRes.data || []);
      } catch (error) {
        console.log("Error fetching support data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ================= STATS ================= */
  const stats = {
    totalDoubts: doubts.length,
    pendingDoubts: doubts.filter((d) => d.status === "Pending").length,
    totalSessions: sessions.length,
    upcomingSessions: sessions.filter(
      (s) => s.status === "Pending" && new Date(s.dateTime) > new Date(),
    ).length,
  };

  const recentDoubts = doubts.slice(0, 3);
  const upcomingSessions = sessions
    .filter((s) => new Date(s.dateTime) > new Date())
    .slice(0, 3);

  const getDoubtStatusLabel = (status) => {
    if (status === "Resolved") return t("studentSupport.status.resolved");
    if (status === "Pending") return t("studentSupport.status.pending");
    return status;
  };

  const getSessionStatusLabel = (status) => {
    if (status === "Approved") return t("studentSupport.status.approved");
    if (status === "Rejected") return t("studentSupport.status.rejected");
    if (status === "Pending") return t("studentSupport.status.pending");
    return status;
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        {t("studentSupport.loading")}
      </div>
    );
  }

  return (
    <>
      <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-4 md:px-10 lg:px-16 pt-8 md:pt-12 pb-16 space-y-10 md:space-y-12">
        {/* ================= HEADER ================= */}
        <section className="rounded-3xl border border-(--border-color) bg-(--bg-surface) p-5 md:p-8 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-(--border-color) bg-(--bg-muted) px-3 py-1 text-xs md:text-sm text-(--text-secondary)">
                <HiOutlineSparkles size={14} /> {t("studentSupport.badge")}
              </span>
              <h1 className="text-3xl md:text-4xl font-semibold mt-3 mb-3">
                {t("studentSupport.title")}
              </h1>
              <p className="text-(--text-secondary) text-sm md:text-base">
                {t("studentSupport.subtitle")}
              </p>
            </div>
          </div>

          {/* ================= STATS CARDS ================= */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-(--card-bg) border border-(--border-color) p-4 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiMessageCircle className="text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-2xl font-bold">{stats.totalDoubts}</span>
              </div>
              <p className="text-sm text-(--text-secondary)">
                {t("studentSupport.stats.totalDoubts")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-(--card-bg) border border-(--border-color) p-4 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <FiAlertCircle className="text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-2xl font-bold">
                  {stats.pendingDoubts}
                </span>
              </div>
              <p className="text-sm text-(--text-secondary)">
                {t("studentSupport.stats.pending")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-(--card-bg) border border-(--border-color) p-4 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FiCalendar className="text-green-600 dark:text-green-400" />
                </div>
                <span className="text-2xl font-bold">
                  {stats.totalSessions}
                </span>
              </div>
              <p className="text-sm text-(--text-secondary)">
                {t("studentSupport.stats.totalSessions")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-(--card-bg) border border-(--border-color) p-4 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FiTrendingUp className="text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-2xl font-bold">
                  {stats.upcomingSessions}
                </span>
              </div>
              <p className="text-sm text-(--text-secondary)">
                {t("studentSupport.stats.upcoming")}
              </p>
            </motion.div>
          </div>

          {/* ================= QUICK ACTIONS ================= */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <ActionCard
              icon={<FiPlusCircle size={18} />}
              title={t("studentSupport.actions.askDoubt.title")}
              desc={t("studentSupport.actions.askDoubt.desc")}
              buttonLabel={t("studentSupport.actions.askDoubt.button")}
              buttonClass="bg-(--color-primary) hover:bg-(--color-primary-hover)"
              onClick={() => setShowAskDoubt(true)}
            />

            <ActionCard
              icon={<FiCalendar size={18} />}
              title={t("studentSupport.actions.bookSession.title")}
              desc={t("studentSupport.actions.bookSession.desc")}
              buttonLabel={t("studentSupport.actions.bookSession.button")}
              buttonClass="bg-(--color-accent) hover:bg-(--color-accent-hover)"
              onClick={() => setShowBooking(true)}
            />

            <ActionCard
              icon={<FiClock size={18} />}
              title={t("studentSupport.actions.tracker.title")}
              desc={t("studentSupport.actions.tracker.desc")}
              buttonLabel={t("studentSupport.actions.tracker.button")}
              buttonClass="bg-(--color-primary) hover:bg-(--color-primary-hover)"
              onClick={() => setShowTracker(true)}
            />
          </div>
        </section>

        {/* ================= RECENT ACTIVITY ================= */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Doubts */}
          <section className="bg-(--card-bg) border border-(--border-color) p-6 rounded-3xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiMessageCircle className="text-(--color-primary)" />
              {t("studentSupport.recentDoubts")}
            </h2>

            {recentDoubts.length > 0 ? (
              <div className="space-y-3">
                {recentDoubts.map((doubt) => (
                  <div
                    key={doubt._id}
                    className="p-4 bg-(--bg-muted) rounded-xl hover:bg-(--bg-surface) transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm">{doubt.subject}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          doubt.status === "Resolved"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                        }`}
                      >
                        {getDoubtStatusLabel(doubt.status)}
                      </span>
                    </div>
                    <p className="text-xs text-(--text-secondary) line-clamp-2">
                      {doubt.message}
                    </p>
                    <p className="text-xs text-(--text-muted) mt-2">
                      {new Date(doubt.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-(--text-secondary) text-center py-8">
                {t("studentSupport.emptyDoubts")}
              </p>
            )}
          </section>

          {/* Upcoming Sessions */}
          <section className="bg-(--card-bg) border border-(--border-color) p-6 rounded-3xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiCalendar className="text-(--color-success)" />
              {t("studentSupport.upcomingSessions")}
            </h2>

            {upcomingSessions.length > 0 ? (
              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <div
                    key={session._id}
                    className="p-4 bg-(--bg-muted) rounded-xl hover:bg-(--bg-surface) transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm">{session.topic}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          session.status === "Approved"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : session.status === "Rejected"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                              : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                        }`}
                      >
                        {getSessionStatusLabel(session.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-(--text-secondary)">
                      <span className="flex items-center gap-1">
                        <FiClock size={12} />
                        {new Date(session.dateTime).toLocaleString()}
                      </span>
                      {session.instructorId?.name && (
                        <span className="flex items-center gap-1">
                          <FiUser size={12} />
                          {session.instructorId.name}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-(--text-secondary) text-center py-8">
                {t("studentSupport.emptySessions")}
              </p>
            )}
          </section>
        </div>

        {/* ================= COURSE MENTORS ================= */}
        <section className="space-y-10">
          <SectionHeader
            icon={<FiBookOpen size={16} />}
            title={t("studentSupport.courseMentors.title")}
            subtitle={t("studentSupport.courseMentors.subtitle")}
          />

          {courses && courses.length > 0 ? (
            courses.map((course, index) => {
              const courseDoubts = doubts.filter(
                (d) => d.courseId === course._id,
              );
              const courseSessions = sessions.filter(
                (s) => s.courseId === course._id,
              );

              return (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl md:text-2xl font-semibold">
                      {course.title[lang]}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-(--text-secondary)">
                      <span className="flex items-center gap-1">
                        <FiMessageCircle size={14} />
                        {courseDoubts.length}{" "}
                        {t("studentSupport.labels.doubts")}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar size={14} />
                        {courseSessions.length}{" "}
                        {t("studentSupport.labels.sessions")}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-(--card-bg) border border-(--border-color) p-5 md:p-6 rounded-3xl flex flex-col shadow-sm hover:shadow-md transition">
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={course.instructor.photo.url}
                          alt={course.instructor.name}
                          className="w-16 h-16 rounded-full object-center object-cover border-2 border-(--color-primary)"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {course.instructor.name}
                          </h3>
                          <p className="text-sm text-(--text-secondary) mt-1">
                            {course.instructor.bio ||
                              t("studentSupport.expertIn", {
                                course: course.title[lang],
                              })}
                          </p>
                        </div>
                      </div>

                      {/* Instructor Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-(--bg-muted) rounded-xl">
                        <div className="text-center">
                          <p className="text-lg font-bold text-(--color-primary)">
                            {
                              courseDoubts.filter(
                                (d) => d.status === "Resolved",
                              ).length
                            }
                          </p>
                          <p className="text-xs text-(--text-muted)">
                            {t("studentSupport.labels.resolved")}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-(--color-success)">
                            {
                              courseSessions.filter(
                                (s) => s.status === "Approved",
                              ).length
                            }
                          </p>
                          <p className="text-xs text-(--text-muted)">
                            {t("studentSupport.labels.sessions")}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-(--color-accent)">
                            ~2h
                          </p>
                          <p className="text-xs text-(--text-muted)">
                            {t("studentSupport.labels.response")}
                          </p>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {course.instructor.skillsAcquired
                          ?.slice(0, 3)
                          .map((skill) => (
                            <span
                              key={skill}
                              className="bg-(--bg-muted) text-(--text-secondary) text-xs px-3 py-1.5 rounded-full"
                            >
                              {skill}
                            </span>
                          )) || (
                          <span className="text-(--color-primary) text-sm">
                            {course.instructor.specialization ||
                              t("studentSupport.courseInstructor")}
                          </span>
                        )}
                        {course.instructor.skillsAcquired?.length > 3 && (
                          <span className="bg-(--bg-muted) text-(--text-muted) text-xs px-3 py-1.5 rounded-full">
                            +{course.instructor.skillsAcquired.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-auto space-y-3">
                        <button
                          onClick={() => {
                            setSelectedInstructor(course.instructor);
                            setSelectedTopic(course);
                            setShowAskDoubt(true);
                          }}
                          className="w-full py-2.5 bg-(--color-primary) text-white rounded-xl cursor-pointer hover:bg-(--color-primary-hover) transition-all inline-flex items-center justify-center gap-2 font-medium"
                        >
                          <FiMessageCircle />
                          {t("studentSupport.buttons.askDoubt")}
                        </button>

                        <button
                          onClick={() => {
                            setSelectedInstructor(course.instructor);
                            setSelectedTopic(course);
                            setShowBooking(true);
                          }}
                          className="w-full py-2.5 border border-(--border-color) rounded-xl hover:bg-(--bg-muted) cursor-pointer transition-all inline-flex items-center justify-center gap-2 font-medium"
                        >
                          <FiCalendar />
                          {t("studentSupport.buttons.bookSession")}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <p className="text-(--text-secondary) text-center py-8">
              {t("studentSupport.emptyCourses")}
            </p>
          )}
        </section>

        {/* ================= AI MENTORS ================= */}
        <section>
          <SectionHeader
            icon={<HiOutlineSparkles size={16} />}
            title={t("studentSupport.aiMentors.title")}
            subtitle={t("studentSupport.aiMentors.subtitle")}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoAiTutors.map((ai) => (
              <motion.div
                key={ai._id}
                whileHover={{ scale: 1.02 }}
                className="bg-(--card-bg) border border-(--border-color) p-5 md:p-6 rounded-3xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={ai.avatar}
                    alt={ai.name}
                    className="w-14 h-14 rounded-full border border-(--border-color)"
                  />
                  <div>
                    <h3 className="font-semibold">{ai.name}</h3>
                    <p className="text-sm text-(--text-secondary)">{ai.role}</p>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-(--bg-muted) rounded-xl">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-(--text-secondary)">
                      {t("studentSupport.availability")}
                    </span>
                    <span className="flex items-center gap-1 text-green-600">
                      <FiCheckCircle size={12} />
                      {t("studentSupport.online")}
                    </span>
                  </div>
                </div>

                <button className="w-full py-2.5 bg-(--color-accent) text-white rounded-xl inline-flex items-center justify-center gap-2 hover:bg-(--color-accent-hover) transition-all font-medium">
                  <FiArrowUpRight size={16} />
                  {t("studentSupport.startAiChat")}
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* ================= MODALS ================= */}
      <BookSessionModal
        isOpen={showBooking}
        onClose={() => {
          setSelectedInstructor(null);
          setSelectedTopic(null);
          setShowBooking(false);
        }}
        selectedInstructor={selectedInstructor}
        selectedTopic={selectedTopic}
      />
      <AskDoubtModal
        isOpen={showAskDoubt}
        selectedInstructor={selectedInstructor}
        onClose={() => {
          setSelectedInstructor(null);
          setSelectedTopic(null);
          setShowAskDoubt(false);
        }}
      />

      <StudentSupportTrackerModal
        isOpen={showTracker}
        onClose={() => setShowTracker(false)}
      />
    </>
  );
};

const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="mb-5 md:mb-6">
    <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
      {icon ? <span className="text-(--color-primary)">{icon}</span> : null}
      {title}
    </h2>
    {subtitle ? (
      <p className="text-(--text-secondary) mt-1 text-sm md:text-base">
        {subtitle}
      </p>
    ) : null}
  </div>
);

const ActionCard = ({
  icon,
  title,
  desc,
  buttonLabel,
  buttonClass,
  onClick,
}) => (
  <div className="bg-(--card-bg) border border-(--border-color) p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
    <div className="w-10 h-10 rounded-xl bg-(--bg-muted) text-(--color-primary) flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm text-(--text-secondary) mb-4">{desc}</p>
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-white rounded-xl cursor-pointer transition-all inline-flex items-center gap-2 ${buttonClass}`}
    >
      <FiArrowUpRight size={16} />
      {buttonLabel}
    </button>
  </div>
);

export default StudentSupport;
