import { motion } from "framer-motion";
import { FiTarget, FiCpu, FiLayers, FiTrendingUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[var(--bg-main)] text-[var(--text-primary)]">

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-24 px-6 md:px-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold"
        >
          About Gradify
        </motion.h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-[var(--text-secondary)]">
          Gradify is an AI-powered learning and progress tracking platform
          designed to help students learn smarter, track performance,
          and achieve academic excellence.
        </p>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section className="px-6 md:px-20 py-20 bg-[var(--bg-surface)] border-y border-[var(--border-color)]">
        <div className="grid md:grid-cols-2 gap-16">

          <div>
            <FiTarget size={32} className="text-[var(--color-primary)] mb-4" />
            <h2 className="text-2xl font-semibold mb-4">
              Our Mission
            </h2>
            <p className="text-[var(--text-secondary)]">
              To simplify and enhance the learning experience through
              structured course management, real-time progress tracking,
              and intelligent AI assistance.
            </p>
          </div>

          <div>
            <FiTrendingUp size={32} className="text-[var(--color-accent)] mb-4" />
            <h2 className="text-2xl font-semibold mb-4">
              Our Vision
            </h2>
            <p className="text-[var(--text-secondary)]">
              To create a next-generation digital learning ecosystem where
              students receive personalized insights and institutions gain
              meaningful academic analytics.
            </p>
          </div>

        </div>
      </section>

      {/* ================= DIFFERENTIATORS ================= */}
      <section className="px-6 md:px-20 py-24">
        <h2 className="text-3xl font-semibold text-center mb-16">
          What Makes Gradify Different?
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <Feature
            icon={<FiCpu size={26} />}
            title="AI Context Awareness"
            desc="Our AI tutor understands course modules and student progress to provide relevant guidance."
          />

          <Feature
            icon={<FiLayers size={26} />}
            title="Structured LMS Architecture"
            desc="Modular course design with lessons, assignments, quizzes, and real-time updates."
          />

          <Feature
            icon={<FiTrendingUp size={26} />}
            title="Performance Intelligence"
            desc="Dashboard insights including streaks, analytics, attendance, and skill tracking."
          />

        </div>
      </section>

      {/* ================= TECH STACK ================= */}
      <section className="px-6 md:px-20 py-24 bg-[var(--bg-surface)] border-y border-[var(--border-color)]">
        <h2 className="text-3xl font-semibold text-center mb-16">
          Built With Modern Technology
        </h2>

        <div className="grid md:grid-cols-4 gap-10 text-center text-[var(--text-secondary)]">

          <TechCard title="Frontend" desc="React + Tailwind CSS" />
          <TechCard title="Backend" desc="Node.js + Express" />
          <TechCard title="Database" desc="MongoDB" />
          <TechCard title="Authentication" desc="JWT + RBAC" />

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 text-center gradient-bg text-white">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6">
          Ready to Experience Smart Learning?
        </h2>

        <button
          onClick={() => navigate("/register")}
          className="px-8 py-4 bg-white text-[var(--color-primary)] font-semibold rounded-xl hover:scale-105 transition-all"
        >
          Join Gradify Today
        </button>
      </section>

    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="bg-[var(--card-bg)] p-8 rounded-2xl border border-[var(--border-color)] shadow-md"
  >
    <div className="text-[var(--color-primary)] mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-[var(--text-secondary)]">{desc}</p>
  </motion.div>
);

const TechCard = ({ title, desc }) => (
  <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm">
    <h3 className="font-semibold mb-2">{title}</h3>
    <p>{desc}</p>
  </div>
);

export default About;