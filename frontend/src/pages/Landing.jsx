import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiBookOpen,
  FiBarChart2,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiGlobe,
  FiLayers,
  FiMessageCircle,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import DashboardPreview from "../assets/images/dashboard.png";
import { useTranslation } from "react-i18next";

const _MotionRef = motion;

const stats = [
  { number: "10K+", labelKey: "landing.stats.lessonsCompleted" },
  { number: "5K+", labelKey: "landing.stats.activeLearners" },
  { number: "300+", labelKey: "landing.stats.partnerInstructors" },
  { number: "98%", labelKey: "landing.stats.studentSatisfaction" },
];

const featureCards = [
  {
    icon: <FiBookOpen size={22} />,
    titleKey: "landing.featureCards.learningPaths.title",
    descKey: "landing.featureCards.learningPaths.desc",
  },
  {
    icon: <FiBarChart2 size={22} />,
    titleKey: "landing.featureCards.liveAnalytics.title",
    descKey: "landing.featureCards.liveAnalytics.desc",
  },
  {
    icon: <FiZap size={22} />,
    titleKey: "landing.featureCards.aiTutor.title",
    descKey: "landing.featureCards.aiTutor.desc",
  },
  {
    icon: <FiBriefcase size={22} />,
    titleKey: "landing.featureCards.careerLayer.title",
    descKey: "landing.featureCards.careerLayer.desc",
  },
  {
    icon: <FiMessageCircle size={22} />,
    titleKey: "landing.featureCards.unifiedCommunication.title",
    descKey: "landing.featureCards.unifiedCommunication.desc",
  },
  {
    icon: <FiShield size={22} />,
    titleKey: "landing.featureCards.roleBasedAccess.title",
    descKey: "landing.featureCards.roleBasedAccess.desc",
  },
];

const workflow = [
  {
    icon: <FiLayers size={20} />,
    titleKey: "landing.workflow.createStructuredCourses.title",
    descKey: "landing.workflow.createStructuredCourses.desc",
  },
  {
    icon: <FiTarget size={20} />,
    titleKey: "landing.workflow.trackLearnerMomentum.title",
    descKey: "landing.workflow.trackLearnerMomentum.desc",
  },
  {
    icon: <FiTrendingUp size={20} />,
    titleKey: "landing.workflow.improveWithInsights.title",
    descKey: "landing.workflow.improveWithInsights.desc",
  },
];

const testimonials = [
  {
    textKey: "landing.testimonials.items.aman.text",
    name: "Aman Sharma",
    roleKey: "landing.testimonials.items.aman.role",
  },
  {
    textKey: "landing.testimonials.items.sneha.text",
    name: "Sneha Patel",
    roleKey: "landing.testimonials.items.sneha.role",
  },
  {
    textKey: "landing.testimonials.items.rohit.text",
    name: "Rohit Verma",
    roleKey: "landing.testimonials.items.rohit.role",
  },
];

const faqs = [
  {
    qKey: "landing.faqs.q1.q",
    aKey: "landing.faqs.q1.a",
  },
  {
    qKey: "landing.faqs.q2.q",
    aKey: "landing.faqs.q2.a",
  },
  {
    qKey: "landing.faqs.q3.q",
    aKey: "landing.faqs.q3.a",
  },
];

const Landing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary)">
      <section className="px-6 md:px-20 pt-10 md:pt-16 pb-20 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-(--bg-surface) border border-(--border-color) text-sm text-(--text-secondary)">
              <FiGlobe size={14} /> {t("landing.badge")}
            </span>

            <h1 className="mt-5 text-4xl md:text-6xl font-bold leading-tight">
              {t("landing.heroTitle")}
              <span className="text-(--color-primary)">
                {" "}
                {t("landing.heroTitleHighlight")}
              </span>
            </h1>

            <p className="mt-6 text-lg text-(--text-secondary) max-w-xl">
              {t("landing.heroSubtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-3 rounded-xl bg-(--color-primary) text-white hover:bg-(--color-primary-hover) transition-all inline-flex items-center gap-2"
              >
                {t("landing.getStarted")} <FiArrowRight />
              </button>
              <button
                onClick={() => navigate("/about")}
                className="px-6 py-3 rounded-xl border border-(--border-color) bg-(--bg-surface) hover:bg-(--bg-muted) transition-all"
              >
                {t("landing.explore")}
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-(--text-secondary)">
              <span className="inline-flex items-center gap-2">
                <FiCheckCircle className="text-(--color-success)" />
                {t("landing.pill1")}
              </span>
              <span className="inline-flex items-center gap-2">
                <FiCheckCircle className="text-(--color-success)" />
                {t("landing.pill2")}
              </span>
              <span className="inline-flex items-center gap-2">
                <FiCheckCircle className="text-(--color-success)" />
                {t("landing.pill3")}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-(--card-bg) border border-(--border-color) rounded-3xl p-5 md:p-7 shadow-md"
          >
            <img
              src={DashboardPreview}
              alt={t("landing.dashboardAlt")}
              className="w-full rounded-2xl border border-(--border-color)"
            />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <MiniKpi
                title={t("landing.miniKpis.weeklyCompletion")}
                value="+24%"
              />
              <MiniKpi
                title={t("landing.miniKpis.assignmentOnTime")}
                value="91%"
              />
              <MiniKpi
                title={t("landing.miniKpis.avgAttendance")}
                value="88%"
              />
              <MiniKpi
                title={t("landing.miniKpis.activeLearners")}
                value="5,200"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 md:px-20 py-12 bg-(--bg-surface) border-y border-(--border-color)">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((item) => (
            <Stat
              key={item.labelKey}
              number={item.number}
              label={t(item.labelKey)}
            />
          ))}
        </div>
      </section>

      <section className="px-6 md:px-20 py-24">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold">
            {t("landing.featuresTitle")}
          </h2>
          <p className="mt-4 text-(--text-secondary)">
            {t("landing.featuresSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feature) => (
            <Feature
              key={feature.titleKey}
              icon={feature.icon}
              title={t(feature.titleKey)}
              desc={t(feature.descKey)}
            />
          ))}
        </div>
      </section>

      <section className="px-6 md:px-20 py-24 bg-(--bg-surface)">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold">
              {t("landing.rolesTitle")}
            </h2>
            <p className="mt-4 text-(--text-secondary)">
              {t("landing.rolesSubtitle")}
            </p>

            <div className="mt-8 space-y-4">
              {[
                t("landing.rolesPoint1"),
                t("landing.rolesPoint2"),
                t("landing.rolesPoint3"),
              ].map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-xl border border-(--border-color) bg-(--card-bg) p-4"
                >
                  <FiCheckCircle className="text-(--color-success) mt-0.5" />
                  <p className="text-(--text-secondary)">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {workflow.map((step, index) => (
              <div
                key={step.titleKey}
                className="rounded-2xl border border-(--border-color) bg-(--card-bg) p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-2 text-(--color-primary)">
                    {step.icon}
                    <span className="font-semibold">
                      {t("landing.step", { number: index + 1 })}
                    </span>
                  </span>
                  <FiClock className="text-(--text-muted)" />
                </div>
                <h3 className="text-lg font-semibold">{t(step.titleKey)}</h3>
                <p className="text-(--text-secondary) mt-2">
                  {t(step.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-20 py-24">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
          {t("landing.testimonialsTitle")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <Testimonial
              key={item.name}
              text={t(item.textKey)}
              name={item.name}
              role={t(item.roleKey)}
            />
          ))}
        </div>
      </section>

      <section className="px-6 md:px-20 pb-24">
        <div className="bg-(--bg-surface) border border-(--border-color) rounded-3xl p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8">
            {t("landing.faqTitle")}
          </h2>

          <div className="grid gap-4">
            {faqs.map((item) => (
              <div
                key={item.qKey}
                className="rounded-xl border border-(--border-color) bg-(--card-bg) p-5"
              >
                <h3 className="text-lg font-semibold">{t(item.qKey)}</h3>
                <p className="mt-2 text-(--text-secondary)">{t(item.aKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-20 pb-24">
        <div className="gradient-bg rounded-3xl px-8 py-14 md:px-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-semibold text-white!">
            {t("landing.ctaTitle")}
          </h2>
          <p className="mt-4 text-white/90 max-w-2xl mx-auto">
            {t("landing.ctaSubtitle")}
          </p>
          <button
            onClick={() => navigate("/register")}
            className="mt-8 px-8 py-4 bg-white text-(--color-primary) font-semibold rounded-xl hover:scale-105 transition-all"
          >
            {t("landing.ctaButton")}
          </button>
        </div>
      </section>
    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="bg-(--card-bg) p-6 rounded-2xl shadow-sm border border-(--border-color)"
  >
    <div className="h-10 w-10 rounded-lg bg-(--bg-muted) text-(--color-primary) flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-(--text-secondary)">{desc}</p>
  </motion.div>
);

const Stat = ({ number, label }) => (
  <div className="rounded-2xl border border-(--border-color) bg-(--card-bg) p-5 text-center">
    <h3 className="text-3xl font-bold text-(--color-primary)">{number}</h3>
    <p className="text-(--text-secondary) mt-2 text-sm md:text-base">{label}</p>
  </div>
);

const MiniKpi = ({ title, value }) => (
  <div className="rounded-xl border border-(--border-color) bg-(--bg-surface) p-3">
    <p className="text-xs text-(--text-muted)">{title}</p>
    <p className="text-lg font-semibold text-(--text-primary)">{value}</p>
  </div>
);

const Testimonial = ({ text, name, role }) => (
  <div className="bg-(--card-bg) p-6 rounded-2xl border border-(--border-color) shadow-sm">
    <p className="text-(--text-secondary) mb-4">“{text}”</p>
    <p className="font-semibold">{name}</p>
    <p className="text-sm text-(--text-muted)">{role}</p>
  </div>
);

export default Landing;
