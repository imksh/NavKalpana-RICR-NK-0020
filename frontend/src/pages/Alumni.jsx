import { useEffect, useState, useMemo } from "react";
import {
  FiExternalLink,
  FiSearch,
  FiFilter,
  FiAward,
  FiTrendingUp,
  FiUsers,
  FiBriefcase,
  FiStar,
} from "react-icons/fi";
import { motion } from "framer-motion";
import api from "../config/api";
import { useTranslation } from "react-i18next";

const _MotionRef = motion;

// Demo data for success stories
const successStories = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Software Engineer",
    company: "Google",
    batchYear: "2022",
    image: "https://i.pravatar.cc/150?img=5",
    story:
      "Gradify's comprehensive curriculum and hands-on projects prepared me exceptionally well for my role at Google. The mentorship program was invaluable.",
    package: "$180K",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Full Stack Developer",
    company: "Microsoft",
    batchYear: "2021",
    image: "https://i.pravatar.cc/150?img=13",
    story:
      "The real-world projects and collaborative learning environment at Gradify gave me the confidence to excel in technical interviews and land my dream job.",
    package: "$165K",
    rating: 5,
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Data Scientist",
    company: "Amazon",
    batchYear: "2023",
    image: "https://i.pravatar.cc/150?img=9",
    story:
      "The AI/ML specialization track was exactly what I needed. Within 6 months of graduation, I secured a position at Amazon with a competitive package.",
    package: "$170K",
    rating: 5,
  },
];

// Demo data for top companies
const topCompanies = [
  { name: "Google", logo: "https://www.google.com/favicon.ico", count: 45 },
  {
    name: "Microsoft",
    logo: "https://www.microsoft.com/favicon.ico",
    count: 38,
  },
  { name: "Amazon", logo: "https://www.amazon.com/favicon.ico", count: 52 },
  { name: "Meta", logo: "https://www.facebook.com/favicon.ico", count: 28 },
  { name: "Netflix", logo: "https://www.netflix.com/favicon.ico", count: 15 },
  { name: "Apple", logo: "https://www.apple.com/favicon.ico", count: 22 },
  { name: "Tesla", logo: "https://www.tesla.com/favicon.ico", count: 12 },
  { name: "Uber", logo: "https://www.uber.com/favicon.ico", count: 18 },
];

const Alumni = () => {
  const { t } = useTranslation();
  const [alumni, setAlumni] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alumniRes, statsRes] = await Promise.all([
          api.get("/public/alumni"),
          api.get("/public/alumni/stats"),
        ]);

        setAlumni(alumniRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.log("Error fetching alumni:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique batch years and companies for filters
  const batchYears = useMemo(() => {
    const years = [...new Set(alumni.map((alum) => alum.batchYear))];
    return years.sort((a, b) => b - a);
  }, [alumni]);

  const companies = useMemo(() => {
    const comps = [...new Set(alumni.map((alum) => alum.company))];
    return comps.sort();
  }, [alumni]);

  // Filter alumni based on search and filters
  const filteredAlumni = useMemo(() => {
    return alumni.filter((alum) => {
      const matchesSearch =
        alum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alum.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alum.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBatch =
        selectedBatch === "all" || alum.batchYear === selectedBatch;
      const matchesCompany =
        selectedCompany === "all" || alum.company === selectedCompany;

      return matchesSearch && matchesBatch && matchesCompany;
    });
  }, [alumni, searchQuery, selectedBatch, selectedCompany]);

  const achievementItems = [
    {
      icon: FiAward,
      value: "150+",
      title: t("alumniPage.achievements.cards.topPerformers.title"),
      description: t("alumniPage.achievements.cards.topPerformers.desc"),
    },
    {
      icon: FiTrendingUp,
      value: "3x",
      title: t("alumniPage.achievements.cards.salaryGrowth.title"),
      description: t("alumniPage.achievements.cards.salaryGrowth.desc"),
    },
    {
      icon: FiUsers,
      value: "2000+",
      title: t("alumniPage.achievements.cards.networkStrength.title"),
      description: t("alumniPage.achievements.cards.networkStrength.desc"),
    },
    {
      icon: FiBriefcase,
      value: "95%",
      title: t("alumniPage.achievements.cards.jobPlacements.title"),
      description: t("alumniPage.achievements.cards.jobPlacements.desc"),
    },
  ];

  const successStoryItems = [
    {
      ...successStories[0],
      role: t("alumniPage.successStories.people.sarah.role"),
      story: t("alumniPage.successStories.people.sarah.story"),
    },
    {
      ...successStories[1],
      role: t("alumniPage.successStories.people.michael.role"),
      story: t("alumniPage.successStories.people.michael.story"),
    },
    {
      ...successStories[2],
      role: t("alumniPage.successStories.people.priya.role"),
      story: t("alumniPage.successStories.people.priya.story"),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-dvh bg-(--bg-main) flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-(--text-secondary)">{t("alumniPage.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary)">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-(--color-primary)/10 via-(--bg-main) to-(--color-secondary)/10 px-6 md:px-16 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-block px-4 py-2 bg-(--card-bg) border border-(--border-color) rounded-full mb-6">
            <span className="text-sm text-(--color-primary) font-medium">
              {t("alumniPage.hero.badge")}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {t("alumniPage.hero.title")}{" "}
            <span className="text-(--color-primary)">
              {t("alumniPage.hero.titleHighlight")}
            </span>
          </h1>
          <p className="text-lg text-(--text-secondary) mb-8 max-w-2xl mx-auto">
            {t("alumniPage.hero.subtitle")}
          </p>
        </motion.div>

        {/* Hero Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto mt-12"
          >
            <StatCard
              title={t("alumniPage.heroStats.totalAlumni")}
              value={stats.totalAlumni}
              icon={FiUsers}
            />
            <StatCard
              title={t("alumniPage.heroStats.placedStudents")}
              value={stats.placedStudents}
              icon={FiBriefcase}
            />
            <StatCard
              title={t("alumniPage.heroStats.topCompanies")}
              value={stats.topCompanies}
              icon={FiAward}
            />
            <StatCard
              title={t("alumniPage.heroStats.avgPackage")}
              value={stats.avgPackage}
              icon={FiTrendingUp}
            />
          </motion.div>
        )}
      </div>

      {/* Achievements Section */}
      <div className="px-6 md:px-16 py-16 bg-(--card-bg) border-y border-(--border-color)">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
            {t("alumniPage.achievements.title")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievementItems.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-(--bg-main) rounded-2xl border border-(--border-color) hover:border-(--color-primary)/50 transition-all"
              >
                <div className="w-12 h-12 bg-(--color-primary)/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <achievement.icon
                    className="text-(--color-primary)"
                    size={24}
                  />
                </div>
                <h3 className="text-3xl font-bold text-(--color-primary) mb-2">
                  {achievement.value}
                </h3>
                <p className="font-semibold mb-1">{achievement.title}</p>
                <p className="text-sm text-(--text-secondary)">
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="px-6 md:px-16 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            {t("alumniPage.successStories.title")}
          </h2>
          <p className="text-center text-(--text-secondary) mb-10 max-w-2xl mx-auto">
            {t("alumniPage.successStories.subtitle")}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {successStoryItems.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{story.name}</h3>
                    <p className="text-sm text-(--text-secondary)">
                      {story.role}
                    </p>
                    <p className="text-xs text-(--color-primary) font-medium">
                      {story.company}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(story.rating)].map((_, i) => (
                      <FiStar
                        key={i}
                        className="text-(--color-warning) fill-current"
                        size={14}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-(--text-secondary) mb-4 leading-relaxed italic">
                  "{story.story}"
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-(--border-color)">
                  <span className="text-xs text-(--text-muted)">
                    {t("alumniPage.batchOf", { year: story.batchYear })}
                  </span>
                  <span className="text-sm font-semibold text-(--color-success)">
                    {story.package}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Companies Section */}
      <div className="px-6 md:px-16 py-16 bg-(--card-bg) border-y border-(--border-color)">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            {t("alumniPage.companies.title")}
          </h2>
          <p className="text-center text-(--text-secondary) mb-10">
            {t("alumniPage.companies.subtitle")}
          </p>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
            {topCompanies.map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-(--bg-main) border border-(--border-color) rounded-xl p-4 hover:border-(--color-primary)/50 transition-all relative group"
                title={t("alumniPage.companies.alumniCount", {
                  count: company.count,
                })}
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-8 h-8 mx-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute -top-2 -right-2 bg-(--color-primary) text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {company.count}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Alumni Directory Section */}
      <div className="px-6 md:px-16 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {t("alumniPage.directory.title")}
          </h2>

          {/* Search and Filters */}
          <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2 relative">
                <FiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                  size={18}
                />
                <input
                  type="text"
                  placeholder={t("alumniPage.filters.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-(--bg-main) border border-(--border-color) rounded-lg focus:outline-none focus:border-(--color-primary) transition-colors"
                />
              </div>

              {/* Batch Filter */}
              <div className="relative">
                <FiFilter
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                  size={18}
                />
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-(--bg-main) border border-(--border-color) rounded-lg focus:outline-none focus:border-(--color-primary) transition-colors appearance-none cursor-pointer"
                >
                  <option value="all">
                    {t("alumniPage.filters.allBatches")}
                  </option>
                  {batchYears.map((year) => (
                    <option key={year} value={year}>
                      {t("alumniPage.batch", { year })}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Filter */}
              <div className="relative">
                <FiBriefcase
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                  size={18}
                />
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-(--bg-main) border border-(--border-color) rounded-lg focus:outline-none focus:border-(--color-primary) transition-colors appearance-none cursor-pointer"
                >
                  <option value="all">
                    {t("alumniPage.filters.allCompanies")}
                  </option>
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-(--text-secondary)">
              {t("alumniPage.results", {
                filtered: filteredAlumni.length,
                total: alumni.length,
              })}
            </div>
          </div>

          {/* Alumni Grid */}
          {filteredAlumni.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-(--bg-muted) rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers size={32} className="text-(--text-muted)" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("alumniPage.empty.title")}
              </h3>
              <p className="text-(--text-secondary)">
                {t("alumniPage.empty.subtitle")}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredAlumni.map((alum, index) => (
                <motion.div
                  key={alum._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 hover:shadow-lg hover:border-(--color-primary)/50 transition-all group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={
                        alum.image?.url ||
                        `https://i.pravatar.cc/150?img=${index + 1}`
                      }
                      alt={alum.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-(--border-color) group-hover:border-(--color-primary) transition-colors"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold truncate">
                        {alum.name}
                      </h3>
                      <p className="text-sm text-(--text-secondary) truncate">
                        {alum.role}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <FiBriefcase
                          size={12}
                          className="text-(--text-muted)"
                        />
                        <p className="text-xs text-(--color-primary) font-medium truncate">
                          {alum.company}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-xs text-(--text-muted)">
                    <FiAward size={12} />
                    <span>
                      {t("alumniPage.batchOf", { year: alum.batchYear })}
                    </span>
                  </div>

                  {alum.skills && alum.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {alum.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-3 py-1 bg-(--bg-muted) rounded-full text-(--text-secondary)"
                        >
                          {skill}
                        </span>
                      ))}
                      {alum.skills.length > 3 && (
                        <span className="text-xs px-3 py-1 bg-(--color-primary)/10 text-(--color-primary) rounded-full font-medium">
                          +{alum.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {alum.linkedin && (
                    <a
                      href={alum.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-(--color-primary) hover:underline text-sm font-medium"
                    >
                      {t("alumniPage.connectLinkedIn")}{" "}
                      <FiExternalLink size={14} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 md:px-16 py-16 bg-linear-to-br from-(--color-primary)/10 via-(--bg-main) to-(--color-secondary)/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("alumniPage.cta.title")}
          </h2>
          <p className="text-lg text-(--text-secondary) mb-8 max-w-2xl mx-auto">
            {t("alumniPage.cta.subtitle")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-3 bg-(--color-primary) text-white rounded-lg font-semibold hover:bg-(--color-primary-dark) transition-colors">
              {t("alumniPage.cta.enrollNow")}
            </button>
            <button className="px-8 py-3 bg-(--card-bg) border border-(--border-color) rounded-lg font-semibold hover:border-(--color-primary) transition-colors">
              {t("alumniPage.cta.learnMore")}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon }) => {
  const _IconRef = Icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl text-center shadow-sm hover:shadow-lg transition-all"
    >
      <div className="w-12 h-12 bg-(--color-primary)/10 rounded-full flex items-center justify-center mx-auto mb-3">
        <_IconRef className="text-(--color-primary)" size={24} />
      </div>
      <h3 className="text-3xl font-bold text-(--color-primary) mb-2">
        {value}
      </h3>
      <p className="text-(--text-secondary) text-sm">{title}</p>
    </motion.div>
  );
};

export default Alumni;
