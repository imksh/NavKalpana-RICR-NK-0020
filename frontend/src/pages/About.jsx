import { motion } from "framer-motion";
import { FiTarget, FiCpu, FiLayers, FiTrendingUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DeveloperSection from "../components/DeveloperSection";

const About = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          {t("about.title")}
        </motion.h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-[var(--text-secondary)]">
          {t("about.subtitle")}
        </p>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section className="px-6 md:px-20 py-20 bg-[var(--bg-surface)] border-y border-[var(--border-color)]">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <FiTarget size={32} className="text-[var(--color-primary)] mb-4" />
            <h2 className="text-2xl font-semibold mb-4">
              {t("about.missionTitle")}
            </h2>
            <p className="text-[var(--text-secondary)]">
              {t("about.missionDesc")}
            </p>
          </div>

          <div>
            <FiTrendingUp
              size={32}
              className="text-[var(--color-accent)] mb-4"
            />
            <h2 className="text-2xl font-semibold mb-4">
              {t("about.visionTitle")}
            </h2>
            <p className="text-[var(--text-secondary)]">
              {t("about.visionDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* ================= DIFFERENTIATORS ================= */}
      <section className="px-6 md:px-20 py-24">
        <h2 className="text-3xl font-semibold text-center mb-16">
          {t("about.differentTitle")}
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <Feature
            icon={<FiCpu size={26} />}
            title={t("about.feature1Title")}
            desc={t("about.feature1Desc")}
          />

          <Feature
            icon={<FiLayers size={26} />}
            title={t("about.feature2Title")}
            desc={t("about.feature2Desc")}
          />

          <Feature
            icon={<FiTrendingUp size={26} />}
            title={t("about.feature3Title")}
            desc={t("about.feature3Desc")}
          />
        </div>
      </section>

      {/* ================= TECH STACK ================= */}
      <section className="px-6 md:px-20 py-24 bg-[var(--bg-surface)] border-y border-[var(--border-color)]">
        <h2 className="text-3xl font-semibold text-center mb-16">
          {t("about.techTitle")}
        </h2>

        <div className="grid md:grid-cols-4 gap-10 text-center text-[var(--text-secondary)]">
          <TechCard title={t("about.frontend")} desc="React + Tailwind CSS" />
          <TechCard title={t("about.backend")} desc="Node.js + Express" />
          <TechCard title={t("about.database")} desc="MongoDB" />
          <TechCard title={t("about.auth")} desc="JWT + RBAC" />
        </div>
      </section>

      <DeveloperSection />

      {/* ================= CTA ================= */}
      <section className="py-24 text-center gradient-bg text-white">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6">
          {t("about.ctaTitle")}
        </h2>

        <button
          onClick={() => navigate("/register")}
          className="px-8 py-4 bg-white text-[var(--color-primary)] font-semibold rounded-xl hover:scale-105 transition-all"
        >
          {t("about.ctaButton")}
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