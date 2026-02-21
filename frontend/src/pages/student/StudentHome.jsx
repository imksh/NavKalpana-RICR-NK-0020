import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiCheckCircle,
  FiAward,
  FiCalendar,
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

const StudentHome = () => {
  const { user } = useAuthStore();
  const [overallScoreInfoModalOpen, setOverallScoreInfoModalOpen] =
    useState(false);

  const navigate = useNavigate();
  const { stats, leaderboard, events, upcommingEvents, init } =
    useStudentStore();
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/student/learning-activity");
      setActivity(res.data.activity.slice(-7)); // Last 30 days
    };
    fetch();
  }, []);

  return (
    <>
      <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-3 md:px-16 pt-12 md:pt-32 pb-16">
        {/* ================= GREETING ================= */}
        <section className="mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold flex">
            Good Morning, {user.name} <FloatingEmojis />
          </h1>
          <p className="text-(--text-secondary) mt-2">
            Here’s your learning progress overview.
          </p>
        </section>

        {/* ================= STAT CARDS ================= */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <StatCard
            icon={<FiTrendingUp />}
            title="Overall Score"
            value={`${stats.overallScore || 0}%`}
            color="text-(--color-primary)"
            onClick={() => setOverallScoreInfoModalOpen(true)}
          />

          <StatCard
            icon={<FiCheckCircle />}
            title="Assignments"
            value={`${stats.submittedAssignments || 0} / ${stats.totalAssignments || 0}`}
            color="text-(--color-success)"
            onClick={() => navigate("/student/assignments")}
          />

          <StatCard
            icon={<FiAward />}
            title="Skills Acquired"
            value={`${stats.skillsAcquired || 0} / ${stats.totalSkills || 0}`}
            color="text-(--color-accent)"
            onClick={() => navigate("/student/courses")}
          />

          <StatCard
            icon={<SiQuizlet />}
            title="Quizzes"
            value={`${stats.attemptedQuizzes || 0} / ${stats.totalQuizzes || 0}`}
            color="text-(--color-warning)"
            onClick={() => navigate("/student/quizzes")}
          />
        </section>

        <section className="mb-12">
          <LearningHeatmap />
        </section>

        {/* ================= CHART + CALENDAR ================= */}
        <section className="grid md:grid-cols-2 gap-8 mb-12 ">
          {/* Weekly Activity */}
          <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-3 md:p-6 shadow-sm flex  flex-col ">
            <h3 className="text-lg font-semibold mb-4 ">
              Weekly Learning Activity
            </h3>
            <div className="h-48 w-full flex items-center justify-center text-(--text-muted) m-auto">
              <ActivityChart data={activity} />
            </div>
          </div>

          {/* Events Calendar */}
          <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-3 md:p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Events Calender</h3>
            <EventsCalendar events={events} />
          </div>
        </section>

        <section className="mb-12">
          <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
            <EventCard upcommingEvents={upcommingEvents} />
          </div>
        </section>

        {/* ================= LEADERBOARD ================= */}
        <section className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Leaderboard</h3>

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
  <motion.div
    whileHover={{ y: -5 }}
    onClick={onClick}
    className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 shadow-sm"
  >
    <div className={`text-2xl mb-3 ${color}`}>{icon}</div>
    <h4 className="text-(--text-secondary) text-sm mb-1">{title}</h4>
    <p className="text-2xl font-semibold">{value}</p>
  </motion.div>
);

const LeaderboardItem = ({ rank, name, score, highlight, photo }) => (
  <div
    className={`flex justify-between items-center px-4 py-3 rounded-xl ${
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
