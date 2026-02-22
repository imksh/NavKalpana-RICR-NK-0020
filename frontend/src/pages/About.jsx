import { motion } from "framer-motion";
import {
  FiTarget,
  FiCpu,
  FiLayers,
  FiTrendingUp,
  FiUsers,
  FiAward,
  FiZap,
  FiHeart,
  FiShield,
  FiStar,
  FiCheckCircle,
  FiBook,
  FiGlobe,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DeveloperSection from "../components/DeveloperSection";

const _MotionRef = motion;

const About = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const stats = [
    {
      icon: FiUsers,
      value: "10,000+",
      label: t("about.stats.activeStudents"),
      color: "text-(--color-primary)",
    },
    {
      icon: FiBook,
      value: "500+",
      label: t("about.stats.coursesAvailable"),
      color: "text-(--color-accent)",
    },
    {
      icon: FiAward,
      value: "95%",
      label: t("about.stats.successRate"),
      color: "text-(--color-success)",
    },
    {
      icon: FiGlobe,
      value: "50+",
      label: t("about.stats.countriesReached"),
      color: "text-(--color-warning)",
    },
  ];

  const values = [
    {
      icon: FiHeart,
      title: t("about.coreValues.cards.studentCentric.title"),
      desc: t("about.coreValues.cards.studentCentric.desc"),
      color: "text-(--color-danger)",
    },
    {
      icon: FiZap,
      title: t("about.coreValues.cards.innovation.title"),
      desc: t("about.coreValues.cards.innovation.desc"),
      color: "text-(--color-warning)",
    },
    {
      icon: FiShield,
      title: t("about.coreValues.cards.quality.title"),
      desc: t("about.coreValues.cards.quality.desc"),
      color: "text-(--color-success)",
    },
    {
      icon: FiStar,
      title: t("about.coreValues.cards.excellence.title"),
      desc: t("about.coreValues.cards.excellence.desc"),
      color: "text-(--color-primary)",
    },
  ];

  const achievements = [
    {
      year: "2020",
      title: t("about.journey.items.founded.title"),
      desc: t("about.journey.items.founded.desc"),
    },
    {
      year: "2021",
      title: t("about.journey.items.first1000.title"),
      desc: t("about.journey.items.first1000.desc"),
    },
    {
      year: "2023",
      title: t("about.journey.items.globalExpansion.title"),
      desc: t("about.journey.items.globalExpansion.desc"),
    },
    {
      year: "2025",
      title: t("about.journey.items.awardRecognition.title"),
      desc: t("about.journey.items.awardRecognition.desc"),
    },
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: t("about.leadership.members.sarah.role"),
      image: "https://i.pravatar.cc/150?img=5",
      bio: t("about.leadership.members.sarah.bio"),
    },
    {
      name: "Michael Chen",
      role: t("about.leadership.members.michael.role"),
      image: "https://i.pravatar.cc/150?img=13",
      bio: t("about.leadership.members.michael.bio"),
    },
    {
      name: "Priya Sharma",
      role: t("about.leadership.members.priya.role"),
      image: "https://i.pravatar.cc/150?img=9",
      bio: t("about.leadership.members.priya.bio"),
    },
    {
      name: "David Martinez",
      role: t("about.leadership.members.david.role"),
      image: "https://i.pravatar.cc/150?img=12",
      bio: t("about.leadership.members.david.bio"),
    },
  ];

  return (
    <div className="bg-(--bg-main) text-(--text-primary) relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-(--color-primary)/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-(--color-secondary)/5 rounded-full blur-3xl translate-x-1/2"></div>

      {/* ================= HERO ================= */}
      <section className="relative pt-32 pb-24 px-6 md:px-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-2 bg-(--card-bg) border border-(--border-color) rounded-full mb-6"
        >
          <span className="text-sm text-(--color-primary) font-medium">
            {t("about.storyBadge")}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          {t("about.title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-(--text-secondary)"
        >
          {t("about.subtitle")}
        </motion.p>
      </section>

      {/* ================= STATS ================= */}
      <section className="relative px-6 md:px-20 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div
                className={`w-12 h-12 ${stat.color} bg-(--color-primary)/10 rounded-lg flex items-center justify-center mx-auto mb-4`}
              >
                <stat.icon size={24} />
              </div>
              <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
              <p className="text-sm text-(--text-secondary)">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section className="relative px-6 md:px-20 py-24 bg-(--bg-surface) border-y border-(--border-color)">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-(--card-bg) border border-(--border-color) rounded-3xl p-8 hover:shadow-xl transition-shadow"
          >
            <div className="w-16 h-16 bg-(--color-primary)/10 rounded-2xl flex items-center justify-center mb-6">
              <FiTarget size={32} className="text-(--color-primary)" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              {t("about.missionTitle")}
            </h2>
            <p className="text-(--text-secondary) leading-relaxed">
              {t("about.missionDesc")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-(--card-bg) border border-(--border-color) rounded-3xl p-8 hover:shadow-xl transition-shadow"
          >
            <div className="w-16 h-16 bg-(--color-accent)/10 rounded-2xl flex items-center justify-center mb-6">
              <FiTrendingUp size={32} className="text-(--color-accent)" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              {t("about.visionTitle")}
            </h2>
            <p className="text-(--text-secondary) leading-relaxed">
              {t("about.visionDesc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= CORE VALUES ================= */}
      <section className="relative px-6 md:px-20 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("about.coreValues.title")}
            </h2>
            <p className="text-(--text-secondary) max-w-2xl mx-auto">
              {t("about.coreValues.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 hover:shadow-lg hover:border-(--color-primary)/50 transition-all"
              >
                <div
                  className={`w-12 h-12 ${value.color} bg-current/10 rounded-lg flex items-center justify-center mb-4`}
                >
                  <value.icon className={value.color} size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-(--text-secondary) leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= JOURNEY TIMELINE ================= */}
      <section className="relative px-6 md:px-20 py-24 bg-(--bg-surface) border-y border-(--border-color)">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("about.journey.title")}
            </h2>
            <p className="text-(--text-secondary)">
              {t("about.journey.subtitle")}
            </p>
          </div>

          <div className="space-y-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="shrink-0 w-20 text-right">
                  <span className="text-2xl font-bold text-(--color-primary)">
                    {achievement.year}
                  </span>
                </div>
                <div className="relative flex-1">
                  <div className="absolute left-0 top-3 w-3 h-3 bg-(--color-primary) rounded-full"></div>
                  {index < achievements.length - 1 && (
                    <div className="absolute left-1.25 top-6 w-0.5 h-full bg-(--border-color)"></div>
                  )}
                  <div className="ml-8 bg-(--card-bg) border border-(--border-color) rounded-xl p-6 hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-lg mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-(--text-secondary) text-sm">
                      {achievement.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LEADERSHIP TEAM ================= */}
      <section className="relative px-6 md:px-20 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("about.leadership.title")}
            </h2>
            <p className="text-(--text-secondary)">
              {t("about.leadership.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 text-center hover:shadow-lg transition-all group"
              >
                <div className="relative mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-(--border-color) group-hover:border-(--color-primary) transition-colors"
                  />
                  <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 w-8 h-8 bg-(--color-primary) rounded-full flex items-center justify-center">
                    <FiCheckCircle className="text-white" size={16} />
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-sm text-(--color-primary) mb-2">
                  {member.role}
                </p>
                <p className="text-xs text-(--text-secondary)">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DIFFERENTIATORS ================= */}
      <section className="relative px-6 md:px-20 py-24 bg-(--bg-surface) border-y border-(--border-color)">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            {t("about.differentTitle")}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Feature
              icon={<FiCpu size={28} />}
              title={t("about.feature1Title")}
              desc={t("about.feature1Desc")}
            />

            <Feature
              icon={<FiLayers size={28} />}
              title={t("about.feature2Title")}
              desc={t("about.feature2Desc")}
            />

            <Feature
              icon={<FiTrendingUp size={28} />}
              title={t("about.feature3Title")}
              desc={t("about.feature3Desc")}
            />
          </div>
        </div>
      </section>

      {/* ================= TECH STACK ================= */}
      <section className="relative px-6 md:px-20 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t("about.techTitle")}
          </h2>
          <p className="text-center text-(--text-secondary) mb-16 max-w-2xl mx-auto">
            {t("about.techSubtitle")}
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            <TechCard
              title={t("about.frontend")}
              desc="React + Tailwind CSS"
              icon={<FiLayers size={24} />}
            />
            <TechCard
              title={t("about.backend")}
              desc="Node.js + Express"
              icon={<FiCpu size={24} />}
            />
            <TechCard
              title={t("about.database")}
              desc="MongoDB"
              icon={<FiTarget size={24} />}
            />
            <TechCard
              title={t("about.auth")}
              desc="JWT + RBAC"
              icon={<FiShield size={24} />}
            />
          </div>
        </div>
      </section>

      <DeveloperSection />

      {/* ================= CTA ================= */}
      <section className="relative py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-(--color-primary)/10 via-(--bg-main) to-(--color-secondary)/10"></div>
        <div className="relative max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-(--card-bg) border border-(--border-color) rounded-3xl p-12 shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("about.ctaTitle")}
            </h2>
            <p className="text-(--text-secondary) mb-8 max-w-2xl mx-auto">
              {t("about.ctaSubtitle")}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-4 bg-(--color-primary) text-white font-semibold rounded-xl hover:bg-(--color-primary-hover) transition-all shadow-lg shadow-(--color-primary)/20"
              >
                {t("about.ctaButton")}
              </button>
              <button
                onClick={() => navigate("/courses")}
                className="px-8 py-4 bg-(--card-bg) border-2 border-(--border-color) font-semibold rounded-xl hover:border-(--color-primary) transition-all"
              >
                {t("about.exploreCourses")}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -6 }}
    className="bg-(--card-bg) p-8 rounded-2xl border border-(--border-color) shadow-md hover:shadow-xl transition-all"
  >
    <div className="w-14 h-14 bg-(--color-primary)/10 rounded-xl flex items-center justify-center mb-6">
      <div className="text-(--color-primary)">{icon}</div>
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-(--text-secondary) leading-relaxed">{desc}</p>
  </motion.div>
);

const TechCard = ({ title, desc, icon }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05 }}
    className="bg-(--card-bg) p-6 rounded-2xl border border-(--border-color) shadow-sm hover:shadow-lg transition-all text-center"
  >
    <div className="w-12 h-12 bg-(--color-primary)/10 rounded-lg flex items-center justify-center mx-auto mb-4">
      <div className="text-(--color-primary)">{icon}</div>
    </div>
    <h3 className="font-bold mb-2">{title}</h3>
    <p className="text-sm text-(--text-secondary)">{desc}</p>
  </motion.div>
);

export default About;
