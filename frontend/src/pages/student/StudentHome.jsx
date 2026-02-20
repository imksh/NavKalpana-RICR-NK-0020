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

const StudentHome = () => {
  const { user } = useAuthStore();
  

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-12 md:pt-32 pb-16">
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
          value="82%"
          color="text-(--color-primary)"
        />

        <StatCard
          icon={<FiCheckCircle />}
          title="Assignments"
          value="12 / 15"
          color="text-(--color-success)"
        />

        <StatCard
          icon={<FiAward />}
          title="Skills Acquired"
          value="8 / 12"
          color="text-(--color-accent)"
        />

        <StatCard
          icon={<SiQuizlet />}
          title="Quizzes"
          value="10 / 12"
          color="text-(--color-warning)"
        />
      </section>

      <section className="mb-12">
        <LearningHeatmap
          data={[
            { date: "2026-02-18", count: 3 },
            { date: "2026-02-17", count: 1 },
            { date: "2026-02-15", count: 2 },
          ]}
        />
      </section>

      {/* ================= CHART + CALENDAR ================= */}
      <section className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Weekly Activity */}
        <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Weekly Learning Activity
          </h3>
          <div className="h-48 flex items-center justify-center text-(--text-muted)">
            Chart Placeholder
          </div>
        </div>

        {/* Events Calendar */}
        <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
          <ul className="space-y-3 text-(--text-secondary)">
            <li>📌 Assignment – React Basics (Tomorrow)</li>
            <li>📝 Quiz – Node Fundamentals (Friday)</li>
            <li>🎓 Webinar – AI in Education (Sunday)</li>
          </ul>
        </div>
      </section>

      {/* ================= LEADERBOARD ================= */}
      <section className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Leaderboard</h3>

        <div className="space-y-4">
          <LeaderboardItem rank="1" name="Aman" score="95%" />
          <LeaderboardItem rank="2" name="Sneha" score="91%" />
          <LeaderboardItem rank="3" name="Rohit" score="88%" />
          <LeaderboardItem rank="4" name="You" score="82%" highlight />
        </div>
      </section>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ icon, title, value, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 shadow-sm"
  >
    <div className={`text-2xl mb-3 ${color}`}>{icon}</div>
    <h4 className="text-(--text-secondary) text-sm mb-1">{title}</h4>
    <p className="text-2xl font-semibold">{value}</p>
  </motion.div>
);

const LeaderboardItem = ({ rank, name, score, highlight }) => (
  <div
    className={`flex justify-between items-center px-4 py-3 rounded-xl ${
      highlight ? "bg-(--bg-muted)" : "bg-transparent"
    }`}
  >
    <span className="font-medium">
      {rank}. {name}
    </span>
    <span className="text-(--color-primary) font-semibold">{score}</span>
  </div>
);

export default StudentHome;
