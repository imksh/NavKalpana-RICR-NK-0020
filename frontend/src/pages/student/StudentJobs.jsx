import { useEffect, useState } from "react";
import {
  FiMapPin,
  FiClock,
  FiBookmark,
  FiSearch,
  FiBriefcase,
  FiCheckCircle,
  FiTrendingUp,
  FiFilter,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../config/api";
import { useNavigate } from "react-router-dom";
import useUiStore from "../../store/useUiStore";
import { useTranslation } from "react-i18next";

const StudentJobs = () => {
  const { lang } = useUiStore();
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedJobs, setBookmarkedJobs] = useState(
    JSON.parse(localStorage.getItem("bookmarkedJobs") || "[]"),
  );
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getLocalizedText = (value) => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
      return value[lang] || value.en || Object.values(value)[0] || "";
    }
    return "";
  };

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsRes, applicationsRes] = await Promise.all([
          api.get("/jobs"),
          api.get("/jobs/my-applications").catch(() => ({ data: [] })),
        ]);

        setJobs(jobsRes.data);
        setApplications(applicationsRes.data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ================= FILTERING & SEARCH ================= */
  useEffect(() => {
    let result = jobs;

    // Filter by type
    if (filter === "Applied") {
      result = jobs.filter((job) => job.hasApplied);
    } else if (filter === "Bookmarked") {
      result = jobs.filter((job) =>
        bookmarkedJobs.some((b) => b._id === job._id),
      );
    } else if (filter !== "All") {
      result = jobs.filter((job) => job.type === filter);
    }

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (job) =>
          getLocalizedText(job.title)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          getLocalizedText(job.company)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          getLocalizedText(job.location)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          job.skills.some((skill) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    setFilteredJobs(result);
  }, [filter, jobs, bookmarkedJobs, searchQuery]);

  /* ================= BOOKMARK HANDLER ================= */
  const handleBookmark = (job) => {
    const isBookmarked = bookmarkedJobs.find((item) => item._id === job._id);

    if (isBookmarked) {
      const updatedBookmarkedJobs = bookmarkedJobs.filter(
        (item) => item._id !== job._id,
      );
      localStorage.setItem(
        "bookmarkedJobs",
        JSON.stringify(updatedBookmarkedJobs),
      );
      setBookmarkedJobs(updatedBookmarkedJobs);
    } else {
      const updatedBookmarkedJobs = [job, ...bookmarkedJobs];
      localStorage.setItem(
        "bookmarkedJobs",
        JSON.stringify(updatedBookmarkedJobs),
      );
      setBookmarkedJobs(updatedBookmarkedJobs);
    }
  };

  /* ================= STATS ================= */
  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.hasApplied).length,
    bookmarked: bookmarkedJobs.length,
    open: jobs.filter((j) => j.status === "open").length,
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        {t("studentJobs.loading")}
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-3 md:px-16 pt-20 md:pt-32 pb-16">
      {/* ================= HEADER ================= */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold mb-3">
          {t("studentJobs.title")}
        </h1>
        <p className="text-(--text-secondary)">{t("studentJobs.subtitle")}</p>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-(--card-bg) border border-(--border-color) p-5 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FiBriefcase className="text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-2xl font-bold">{stats.total}</span>
          </div>
          <p className="text-sm text-(--text-secondary)">
            {t("studentJobs.stats.total")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-(--card-bg) border border-(--border-color) p-5 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FiCheckCircle className="text-green-600 dark:text-green-400" />
            </div>
            <span className="text-2xl font-bold">{stats.applied}</span>
          </div>
          <p className="text-sm text-(--text-secondary)">
            {t("studentJobs.stats.applied")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-(--card-bg) border border-(--border-color) p-5 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <FiBookmark className="text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-2xl font-bold">{stats.bookmarked}</span>
          </div>
          <p className="text-sm text-(--text-secondary)">
            {t("studentJobs.stats.bookmarked")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-(--card-bg) border border-(--border-color) p-5 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FiTrendingUp className="text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-2xl font-bold">{stats.open}</span>
          </div>
          <p className="text-sm text-(--text-secondary)">
            {t("studentJobs.stats.open")}
          </p>
        </motion.div>
      </div>

      {/* ================= SEARCH & FILTER ================= */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("studentJobs.searchPlaceholder")}
            className="w-full pl-12 pr-4 py-3 bg-(--card-bg) border border-(--border-color) rounded-xl focus:outline-none focus:border-(--color-primary) transition"
          />
        </div>

        {/* Filter Indicator */}
        <div className="flex items-center gap-2 px-4 py-3 bg-(--card-bg) border border-(--border-color) rounded-xl">
          <FiFilter className="text-(--text-muted)" />
          <span className="text-sm text-(--text-secondary)">
            {t("studentJobs.showing", {
              filtered: filteredJobs.length,
              total: jobs.length,
            })}
          </span>
        </div>
      </div>

      {/* ================= FILTER TABS ================= */}
      <div className="flex gap-2 md:gap-3 mb-10 overflow-auto hide-scrollbar pb-2">
        {[
          { id: "All", label: t("studentJobs.filters.all") },
          { id: "Internship", label: t("studentJobs.filters.internship") },
          { id: "Full-Time", label: t("studentJobs.filters.fullTime") },
          { id: "Applied", label: t("studentJobs.filters.applied") },
          { id: "Bookmarked", label: t("studentJobs.filters.bookmarked") },
        ].map((tab) => {
          const type = tab.id;
          const count =
            type === "All"
              ? jobs.length
              : type === "Applied"
                ? stats.applied
                : type === "Bookmarked"
                  ? stats.bookmarked
                  : jobs.filter((j) => j.type === type).length;

          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-xl text-nowrap text-sm font-medium transition flex items-center gap-2 ${
                filter === type
                  ? "bg-(--color-primary) text-white shadow-md"
                  : "bg-(--bg-muted) hover:bg-(--bg-surface)"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  filter === type ? "bg-white/20" : "bg-(--bg-surface)"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ================= JOB LIST ================= */}
      {filteredJobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 bg-(--bg-muted) rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBriefcase size={32} className="text-(--text-muted)" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {t("studentJobs.empty.title")}
          </h3>
          <p className="text-(--text-secondary)">
            {searchQuery
              ? t("studentJobs.empty.adjust")
              : t("studentJobs.empty.noJobs")}
          </p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredJobs.map((job, index) => {
              const isBookmarked = bookmarkedJobs?.find(
                (item) => item._id === job._id,
              );
              const applicationStatus = applications.find(
                (app) => app.jobId === job._id,
              )?.status;

              return (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl shadow-sm hover:shadow-md transition group"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <h3 className="text-lg font-semibold group-hover:text-(--color-primary) transition">
                          {getLocalizedText(job.title)}
                        </h3>
                        {job.hasApplied && (
                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                            {t("studentJobs.applied")}
                          </span>
                        )}
                      </div>
                      <p className="text-(--text-secondary) text-sm mt-1">
                        {getLocalizedText(job.company)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleBookmark(job)}
                      className={`p-2 rounded-lg transition ${
                        isBookmarked
                          ? "bg-orange-100 dark:bg-orange-900/30"
                          : "hover:bg-(--bg-muted)"
                      }`}
                    >
                      <FiBookmark
                        className={
                          isBookmarked
                            ? "text-orange-600 dark:text-orange-400"
                            : "text-(--text-secondary)"
                        }
                        fill={isBookmarked ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  {/* Type Badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        job.type === "Full-Time"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                      }`}
                    >
                      {job.type === "Full-Time"
                        ? t("studentJobs.filters.fullTime")
                        : t("studentJobs.filters.internship")}
                    </span>
                  </div>

                  {/* Location & Deadline */}
                  <div className="flex flex-wrap gap-4 text-sm text-(--text-secondary) mb-4">
                    <span className="flex items-center gap-1.5">
                      <FiMapPin size={14} /> {getLocalizedText(job.location)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiClock size={14} />
                      {new Date(job.deadline) < new Date() ? (
                        <span className="text-red-600">
                          {t("studentJobs.expired")}
                        </span>
                      ) : (
                        t("studentJobs.due", {
                          date: new Date(job.deadline).toLocaleDateString(),
                        })
                      )}
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 bg-(--bg-muted) rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="text-xs px-3 py-1 bg-(--bg-muted) rounded-full text-(--text-muted)">
                        +{job.skills.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  {job.status === "close" && (
                    <div className="mb-4">
                      <span className="inline-block text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full">
                        {t("studentJobs.closed")}
                      </span>
                    </div>
                  )}

                  {/* Application Status */}
                  {applicationStatus && (
                    <div className="mb-4 p-3 bg-(--bg-muted) rounded-lg">
                      <p className="text-xs text-(--text-muted) mb-1">
                        {t("studentJobs.applicationStatus")}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          applicationStatus === "Accepted"
                            ? "text-green-600"
                            : applicationStatus === "Rejected"
                              ? "text-red-600"
                              : "text-yellow-600"
                        }`}
                      >
                        {applicationStatus}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-(--border-color)">
                    <div>
                      <p className="text-xs text-(--text-muted) mb-1">
                        {job.type === "Internship"
                          ? t("studentJobs.stipend")
                          : t("studentJobs.salary")}
                      </p>
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        {job.stipend || job.salary}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/student/jobs/${job._id}`)}
                      className={`px-6 py-2.5 text-white rounded-xl font-medium transition ${
                        job.hasApplied
                          ? "bg-green-600 hover:bg-green-700"
                          : job.status === "open"
                            ? "bg-(--color-primary) hover:opacity-90"
                            : "bg-gray-500 hover:bg-gray-600"
                      }`}
                    >
                      {job.hasApplied
                        ? t("studentJobs.buttons.viewApplication")
                        : job.status === "open"
                          ? t("studentJobs.buttons.applyNow")
                          : t("studentJobs.buttons.viewDetails")}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default StudentJobs;
