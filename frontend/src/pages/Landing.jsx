import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiBookOpen,
  FiBarChart2,
  FiZap,
  FiTrendingUp,
  FiAward
} from "react-icons/fi";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary)">

      {/* ================= HERO ================= */}
      <section className="px-6 md:px-20 text-center min-h-[90dvh] flex flex-col justify-center">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          Smart Learning. <br />
          <span className="text-(--color-primary)">
            Powered by AI.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 max-w-2xl mx-auto text-lg text-(--text-secondary)"
        >
          Gradify combines structured LMS architecture with intelligent AI
          tutoring to help students track progress and master skills faster.
        </motion.p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 rounded-xl bg-(--color-primary) text-white hover:bg-(--color-primary-hover) transition-all flex items-center gap-2"
          >
            Get Started <FiArrowRight />
          </button>

          <button
            onClick={() => navigate("/about")}
            className="px-6 py-3 rounded-xl border border-(--border-color) hover:bg-(--bg-muted) transition-all"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="px-6 md:px-20 py-20 bg-(--bg-surface)">
        <div className="grid md:grid-cols-4 gap-10 text-center">

          <Stat number="10K+" label="Lessons Completed" />
          <Stat number="5K+" label="Active Students" />
          <Stat number="98%" label="Satisfaction Rate" />
          <Stat number="24/7" label="AI Support" />

        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="px-6 md:px-20 py-24">
        <h2 className="text-3xl font-semibold text-center mb-16">
          Everything You Need in One Platform
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <Feature
            icon={<FiBookOpen size={26} />}
            title="Structured Learning"
            desc="Organized courses, modules, assignments, and quizzes with real-time updates."
          />

          <Feature
            icon={<FiBarChart2 size={26} />}
            title="Performance Analytics"
            desc="Interactive dashboards showing attendance, streaks, and skill growth."
          />

          <Feature
            icon={<FiTrendingUp size={26} />}
            title="Progress Tracking"
            desc="Auto-updating course completion and performance metrics."
          />

        </div>
      </section>

      {/* ================= AI TUTOR SECTION ================= */}
      <section className="px-6 md:px-20 py-24 bg-(--bg-surface)">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* AI CHARACTER */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="w-72 h-72 rounded-full bg-(--color-primary) flex items-center justify-center shadow-lg">
              <FiZap size={80} className="text-white" />
            </div>
          </motion.div>

          {/* TEXT */}
          <div>
            <h2 className="text-3xl font-semibold mb-6">
              Meet Your AI Tutor
            </h2>

            <p className="text-(--text-secondary) mb-6">
              Your personal AI learning assistant understands course
              modules, analyzes weak areas, and provides intelligent
              recommendations in real-time.
            </p>

            <ul className="space-y-3 text-(--text-secondary)">
              <li>✔ Context-aware responses</li>
              <li>✔ Personalized learning plans</li>
              <li>✔ Instant doubt solving</li>
              <li>✔ Smart progress suggestions</li>
            </ul>
          </div>

        </div>
      </section>

      {/* ================= DASHBOARD PREVIEW ================= */}
      <section className="px-6 md:px-20 py-24">
        <h2 className="text-3xl font-semibold text-center mb-16">
          Powerful Student Dashboard
        </h2>

        <div className="bg-(--card-bg) border border-(--border-color) rounded-3xl p-10 shadow-md text-center text-(--text-muted)">
          Dashboard Preview Mockup
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="px-6 md:px-20 py-24 bg-(--bg-surface)">
        <h2 className="text-3xl font-semibold text-center mb-16">
          What Students Say
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <Testimonial
            text="Gradify completely changed the way I track my academic progress."
            name="Aman Sharma"
          />
          <Testimonial
            text="The AI tutor helped me understand complex topics faster."
            name="Sneha Patel"
          />
          <Testimonial
            text="Clean UI, powerful analytics, and real-time tracking."
            name="Rohit Verma"
          />
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="px-6 md:px-20 py-24 text-center gradient-bg text-white">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 !text-white">
          Ready to Elevate Your Learning?
        </h2>

        <button
          onClick={() => navigate("/register")}
          className="px-8 py-4 bg-white text-(--color-primary) font-semibold rounded-xl hover:scale-105 transition-all"
        >
          Start Learning Today
        </button>
      </section>

    </div>
  );
};

/* ================= COMPONENTS ================= */

const Feature = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -8 }}
    className="bg-(--card-bg) p-8 rounded-2xl shadow-md border border-(--border-color)"
  >
    <div className="text-(--color-primary) mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-(--text-secondary)">{desc}</p>
  </motion.div>
);

const Stat = ({ number, label }) => (
  <div>
    <h3 className="text-3xl font-bold text-(--color-primary)">
      {number}
    </h3>
    <p className="text-(--text-secondary) mt-2">
      {label}
    </p>
  </div>
);

const Testimonial = ({ text, name }) => (
  <div className="bg-(--card-bg) p-8 rounded-2xl border border-(--border-color) shadow-sm">
    <p className="text-(--text-secondary) mb-4">“{text}”</p>
    <span className="font-semibold">{name}</span>
  </div>
);

export default Landing;