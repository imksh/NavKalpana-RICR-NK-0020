import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import {
  FiSearch,
  FiFilter,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiTarget,
  FiAward,
  FiBook,
} from "react-icons/fi";
import api from "../../config/api";
import { useTranslation } from "react-i18next";

const Quizzes = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get("/student/quizzes");
        setQuizzes(res.data);
      } catch (error) {
        console.log("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Calculate stats from quizzes
  const stats = useMemo(() => {
    const total = quizzes.length;
    const attempted = quizzes.filter((q) => q.attempted).length;
    const pending = quizzes.filter((q) => !q.attempted).length;

    const attemptedQuizzes = quizzes.filter(
      (q) => q.attempted && q.score !== null,
    );
    const avgScore =
      attemptedQuizzes.length > 0
        ? (
            attemptedQuizzes.reduce((sum, q) => sum + q.score, 0) /
            attemptedQuizzes.length
          ).toFixed(1)
        : 0;

    const passedQuizzes = attemptedQuizzes.filter((q) => q.score >= 60).length;
    const passRate =
      attemptedQuizzes.length > 0
        ? ((passedQuizzes / attemptedQuizzes.length) * 100).toFixed(0)
        : 0;

    return { total, attempted, pending, avgScore, passRate };
  }, [quizzes]);

  // Filter, search and sort quizzes
  const filteredQuizzes = useMemo(() => {
    let filtered = quizzes;

    // Apply status filter
    if (filter === "attempted") {
      filtered = filtered.filter((q) => q.attempted);
    } else if (filter === "pending") {
      filtered = filtered.filter((q) => !q.attempted);
    } else if (filter === "passed") {
      filtered = filtered.filter((q) => q.attempted && q.score >= 60);
    } else if (filter === "failed") {
      filtered = filtered.filter((q) => q.attempted && q.score < 60);
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (q) =>
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.course.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort quizzes
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "course") {
        return a.course.localeCompare(b.course);
      } else if (sortBy === "score") {
        if (!a.attempted) return 1;
        if (!b.attempted) return -1;
        return (b.score || 0) - (a.score || 0);
      } else if (sortBy === "duration") {
        return a.duration - b.duration;
      }
      return 0;
    });

    return filtered;
  }, [quizzes, filter, searchQuery, sortBy]);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-(--color-success)";
    if (score >= 60) return "text-(--color-warning)";
    return "text-(--color-danger)";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-(--color-success)";
    if (score >= 60) return "bg-(--color-warning)";
    return "bg-(--color-danger)";
  };

  const getGrade = (score) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-(--bg-main) flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-(--text-secondary)">{t("quizzes.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-3 md:px-16 pt-20 md:pt-32 pb-16">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {t("quizzes.title")}
        </h1>
        <p className="text-(--text-secondary)">{t("quizzes.subtitle")}</p>
      </div>

      {/* STATS DASHBOARD */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-(--color-primary)/10 rounded-lg flex items-center justify-center">
              <FiBook className="text-(--color-primary)" size={20} />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-(--color-primary)">
            {stats.total}
          </h3>
          <p className="text-xs md:text-sm text-(--text-secondary) mt-1">
            {t("quizzes.stats.total")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-(--color-success)/10 rounded-lg flex items-center justify-center">
              <FiCheckCircle className="text-(--color-success)" size={20} />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-(--color-success)">
            {stats.attempted}
          </h3>
          <p className="text-xs md:text-sm text-(--text-secondary) mt-1">
            {t("quizzes.stats.attempted")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-(--color-warning)/10 rounded-lg flex items-center justify-center">
              <FiAlertCircle className="text-(--color-warning)" size={20} />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-(--color-warning)">
            {stats.pending}
          </h3>
          <p className="text-xs md:text-sm text-(--text-secondary) mt-1">
            {t("quizzes.stats.pending")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-(--color-primary)/10 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="text-(--color-primary)" size={20} />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-(--color-primary)">
            {stats.avgScore}%
          </h3>
          <p className="text-xs md:text-sm text-(--text-secondary) mt-1">
            {t("quizzes.stats.avgScore")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-(--color-success)/10 rounded-lg flex items-center justify-center">
              <FiTarget className="text-(--color-success)" size={20} />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-(--color-success)">
            {stats.passRate}%
          </h3>
          <p className="text-xs md:text-sm text-(--text-secondary) mt-1">
            {t("quizzes.stats.passRate")}
          </p>
        </motion.div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 md:p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
              size={18}
            />
            <input
              type="text"
              placeholder={t("quizzes.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-(--bg-main) border border-(--border-color) rounded-lg focus:outline-none focus:border-(--color-primary) transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "attempted", "passed", "failed"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  filter === type
                    ? "bg-(--color-primary) text-white"
                    : "bg-(--bg-muted) hover:bg-(--bg-muted)/70"
                }`}
              >
                {t(`quizzes.filters.${type}`)}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative">
            <FiFilter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
              size={18}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-(--bg-main) border border-(--border-color) rounded-lg focus:outline-none focus:border-(--color-primary) transition-colors appearance-none cursor-pointer"
            >
              <option value="title">{t("quizzes.sort.title")}</option>
              <option value="course">{t("quizzes.sort.course")}</option>
              <option value="score">{t("quizzes.sort.score")}</option>
              <option value="duration">{t("quizzes.sort.duration")}</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-(--text-secondary)">
          {t("quizzes.showing", {
            filtered: filteredQuizzes.length,
            total: quizzes.length,
          })}
        </div>
      </div>

      {/* QUIZ GRID */}
      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-(--bg-muted) rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBook size={32} className="text-(--text-muted)" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {t("quizzes.empty.title")}
          </h3>
          <p className="text-(--text-secondary)">
            {searchQuery || filter !== "all"
              ? t("quizzes.empty.adjust")
              : t("quizzes.empty.none")}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className={`bg-(--card-bg) border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all ${
                quiz.attempted && quiz.score >= 60
                  ? "border-(--color-success)/50"
                  : quiz.attempted && quiz.score < 60
                    ? "border-(--color-danger)/50"
                    : "border-(--border-color) hover:border-(--color-primary)/50"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {quiz.title}
                  </h3>
                  <span className="inline-block text-xs px-3 py-1 bg-(--color-primary)/10 text-(--color-primary) rounded-full font-medium">
                    {quiz.course}
                  </span>
                </div>
                {quiz.attempted ? (
                  <FiCheckCircle
                    className="shrink-0 ml-2 text-(--color-success)"
                    size={24}
                  />
                ) : (
                  <FiClock
                    className="shrink-0 ml-2 text-(--color-warning)"
                    size={24}
                  />
                )}
              </div>

              {/* Quiz Info */}
              <div className="flex items-center gap-4 text-sm text-(--text-secondary) mb-4 mt-4">
                <div className="flex items-center gap-1">
                  <FiBook size={14} />
                  <span>
                    {quiz.totalQuestions} {t("quizzes.questions")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <FiClock size={14} />
                  <span>
                    {quiz.duration} {t("quizzes.mins")}
                  </span>
                </div>
              </div>

              {/* Score Section */}
              {quiz.attempted ? (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-(--text-secondary)">
                      {t("quizzes.yourScore")}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-2xl font-bold ${getScoreColor(quiz.score)}`}
                      >
                        {quiz.score}%
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${getScoreBgColor(quiz.score)} text-white`}
                      >
                        {getGrade(quiz.score)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-(--bg-muted) rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getScoreBgColor(quiz.score)}`}
                      style={{ width: `${quiz.score}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-(--color-warning)/10 border border-(--color-warning)/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FiAlertCircle
                      className="text-(--color-warning)"
                      size={16}
                    />
                    <span className="text-sm font-medium text-(--color-warning)">
                      {t("quizzes.notAttempted")}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => navigate(`/student/quizzes/${quiz._id}`)}
                className="w-full py-2.5 rounded-xl bg-(--color-primary) text-white font-medium hover:bg-(--color-primary-hover) transition-colors"
              >
                {quiz.attempted ? t("quizzes.viewResults") : t("quizzes.start")}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quizzes;
