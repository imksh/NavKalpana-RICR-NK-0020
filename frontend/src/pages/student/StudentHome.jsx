import {
  FiTrendingUp,
  FiCheckCircle,
  FiAward,
  FiCalendar,
  FiArrowUpRight,
} from "react-icons/fi";
import { SiQuizlet } from "react-icons/si";
import { useAuthStore } from "../../store/useAuthStore";
import LearningHeatmap from "../../components/student/LearningHeatmap";
import FloatingEmojis from "../../components/FloatingEmojis";
import { useStudentStore } from "../../store/useStudentStore";
import { useEffect } from "react";
import api from "../../config/api";
import { useState } from "react";
import ActivityChart from "../../components/ActivityChart";
import EventsCalendar from "../../components/EventCalender";
import { useNavigate } from "react-router-dom";
import OverallScoreInfoModal from "../../components/student/modal/OverallScoreInfoModal";
import EventCard from "../../components/EventCard";
import LottieIcon from "../../components/LottieIcon";
import Learning from "../../assets/animations/learning.json";
import { useTranslation } from "react-i18next";

const StudentHome = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [overallScoreInfoModalOpen, setOverallScoreInfoModalOpen] =
    useState(false);

  const navigate = useNavigate();
  const { stats, leaderboard, events, upcommingEvents, init } =
    useStudentStore();
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/student/learning-activity");
      setActivity(res.data.activity.slice(-7)); // Last 30 days
    };
    fetch();
  }, []);

  const getPersonalGreeting = (name = "") => {
    const hour = new Date().getHours();

    let greeting;

    if (hour < 12) greeting = t("studentHome.greetings.morning");
    else if (hour < 17) greeting = t("studentHome.greetings.afternoon");
    else if (hour < 21) greeting = t("studentHome.greetings.evening");
    else greeting = t("studentHome.greetings.night");

    return `${greeting}${name ? `, ${name}` : ""}`;
  };

  return (
    <>
      <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-3 md:px-10 lg:px-16 pt-8 md:pt-12 pb-16">
        <section className="mb-8 md:mb-10 rounded-3xl border border-(--border-color) bg-(--bg-surface) px-5 py-6 md:px-8 md:py-8 shadow-sm">
          <div className="flex items-start gap-4 md:gap-6">
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-(--border-color) bg-(--bg-muted) px-3 py-1 text-xs md:text-sm text-(--text-secondary)">
                <FiTrendingUp size={14} /> {t("studentHome.badge")}
              </span>
              <h1 className="mt-3 text-2xl md:text-4xl font-semibold leading-tight flex flex-wrap items-center gap-1.5">
                {getPersonalGreeting(user.name)} <FloatingEmojis />
              </h1>
              <p className="text-(--text-secondary) mt-2 text-sm md:text-base max-w-2xl">
                {t("studentHome.subtitle")}
              </p>
            </div>

            <div className="hidden md:block">
              <div className="rounded-2xl border border-(--border-color) bg-(--card-bg) px-3 py-2">
                <LottieIcon animation={Learning} className="w-34 lg:w-40" />
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-8 md:mb-10">
          <StatCard
            icon={<FiTrendingUp />}
            title={t("studentHome.stats.overallScore")}
            value={`${stats.overallScore || 0}%`}
            color="text-(--color-primary)"
            onClick={() => setOverallScoreInfoModalOpen(true)}
          />

          <StatCard
            icon={<FiCheckCircle />}
            title={t("studentHome.stats.assignments")}
            value={`${stats.submittedAssignments || 0} / ${stats.totalAssignments || 0}`}
            color="text-(--color-success)"
            onClick={() => navigate("/student/assignments")}
          />

          <StatCard
            icon={<FiAward />}
            title={t("studentHome.stats.skills")}
            value={`${stats.skillsAcquired || 0} / ${stats.totalSkills || 0}`}
            color="text-(--color-accent)"
            onClick={() => navigate("/student/courses")}
          />

          <StatCard
            icon={<SiQuizlet />}
            title={t("studentHome.stats.quizzes")}
            value={`${stats.attemptedQuizzes || 0} / ${stats.totalQuizzes || 0}`}
            color="text-(--color-warning)"
            onClick={() => navigate("/student/quizzes")}
          />
        </section>

        <section className="mb-8 md:mb-10 rounded-3xl border border-(--border-color) bg-(--bg-surface) p-3 md:p-5 shadow-sm">
          <SectionHeader
            title={t("studentHome.learningConsistency.title")}
            subtitle={t("studentHome.learningConsistency.subtitle")}
          />
          <LearningHeatmap />
        </section>

        <section className="grid md:grid-cols-2 gap-5 md:gap-6 mb-8 md:mb-10">
          <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-3 md:p-5 shadow-sm flex flex-col">
            <SectionHeader
              title={t("studentHome.weeklyActivity.title")}
              subtitle={t("studentHome.weeklyActivity.subtitle")}
            />
            <div className="h-48 w-full flex items-center justify-center text-(--text-muted) m-auto">
              <ActivityChart data={activity} />
            </div>
          </div>

          <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-3 md:p-5 shadow-sm">
            <SectionHeader
              title={t("studentHome.eventsCalendar.title")}
              subtitle={t("studentHome.eventsCalendar.subtitle")}
            />
            <EventsCalendar events={events} />
          </div>
        </section>

        <section className="mb-8 md:mb-10">
          <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 md:p-6 shadow-sm">
            <SectionHeader
              icon={<FiCalendar size={16} />}
              title={t("studentHome.upcomingEvents.title")}
              subtitle={t("studentHome.upcomingEvents.subtitle")}
            />
            <EventCard upcommingEvents={upcommingEvents} />
          </div>
        </section>

        <section className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 md:p-6 shadow-sm">
          <SectionHeader
            title={t("studentHome.leaderboard.title")}
            subtitle={t("studentHome.leaderboard.subtitle")}
          />

          <div className="space-y-4">
            {leaderboard.map((item, index) => (
              <LeaderboardItem
                key={index}
                rank={item.rank}
                name={item.name}
                photo={item.photo}
                score={item.score}
                highlight={item.highlight}
              />
            ))}
          </div>
        </section>
      </div>
      {/* ================= OVERALL SCORE INFO MODAL ================= */}
      <OverallScoreInfoModal
        isOpen={overallScoreInfoModalOpen}
        onClose={() => setOverallScoreInfoModalOpen(false)}
        avgAssignmentMarks={stats.avgAssignmentMarks}
        avgQuizScore={stats.avgQuizScore}
        attendancePercent={stats.attendancePercent}
        courseCompletionPercent={stats.courseCompletionPercent}
        overallScore={stats.overallScore}
      />
    </>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ icon, title, value, color, onClick }) => (
  <div
    onClick={onClick}
    className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 md:p-5 shadow-sm cursor-pointer hover:shadow-md transition flex flex-col items-start"
  >
    <div className="w-full flex items-start justify-between gap-2">
      <div className={`text-2xl mb-3 ${color}`}>{icon}</div>
      <span className="text-(--text-muted)">
        <FiArrowUpRight size={16} />
      </span>
    </div>
    <h4 className="text-(--text-secondary) text-xs md:text-sm mb-1">{title}</h4>
    <p className="text-xl md:text-2xl font-semibold leading-tight">{value}</p>
  </div>
);

const SectionHeader = ({ title, subtitle, icon }) => (
  <div className="mb-4 md:mb-5">
    <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
      {icon ? <span className="text-(--color-primary)">{icon}</span> : null}
      {title}
    </h3>
    {subtitle ? (
      <p className="text-(--text-secondary) mt-1 text-sm">{subtitle}</p>
    ) : null}
  </div>
);

const LeaderboardItem = ({ rank, name, score, highlight, photo }) => (
  <div
    className={`flex justify-between items-center px-3 md:px-4 py-3 rounded-xl border border-transparent ${
      highlight ? "bg-(--bg-muted)" : "bg-transparent"
    }`}
  >
    <div className="flex items-center space-x-3">
      <span className="font-bold">{rank}.</span>
      <img
        src={photo?.url || "/default-avatar.png"}
        alt={name}
        className="w-8 h-8 rounded-full object-cover"
      />
      <span className="font-medium">{name}</span>
    </div>
    <span className="text-(--color-success) font-semibold">{score}%</span>
  </div>
);

export default StudentHome;
