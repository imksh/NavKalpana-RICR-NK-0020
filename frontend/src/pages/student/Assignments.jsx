import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiCalendar,
  FiFileText,
  FiCpu,
  FiRefreshCw,
} from "react-icons/fi";
import api from "../../config/api";
import { useTranslation } from "react-i18next";
import LoadingWave from "../../components/LoadingWave";

const _MotionRef = motion;

const parseAiInsightResponse = (rawResponse) => {
  const jsonMatch = rawResponse?.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  const parsed = JSON.parse(jsonMatch[0]);
  return {
    summary: parsed.summary || rawResponse,
    priority: parsed.priority || "Medium",
    actions: Array.isArray(parsed.actions) ? parsed.actions : [],
  };
};

const Assignments = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [aiInsight, setAiInsight] = useState(null);
  const [aiInsightLoading, setAiInsightLoading] = useState(false);
  const [aiInsightError, setAiInsightError] = useState("");
  const aiInsightRequestedRef = useRef(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get("/student/assignments");
        setAssignments(res.data);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  // Calculate stats from assignments
  const stats = useMemo(() => {
    const total = assignments.length;
    const pending = assignments.filter((a) => a.status === "Pending").length;
    const submitted = assignments.filter(
      (a) => a.status === "Submitted",
    ).length;
    const evaluated = assignments.filter(
      (a) => a.status === "Evaluated",
    ).length;

    const evaluatedAssignments = assignments.filter(
      (a) => a.status === "Evaluated" && a.marks !== null,
    );
    const avgScore =
      evaluatedAssignments.length > 0
        ? (
            evaluatedAssignments.reduce((sum, a) => sum + a.marks, 0) /
            evaluatedAssignments.length
          ).toFixed(1)
        : 0;

    // Upcoming deadlines (within 3 days)
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const upcoming = assignments.filter((a) => {
      const deadline = new Date(a.deadline);
      return (
        a.status === "Pending" &&
        deadline >= now &&
        deadline <= threeDaysFromNow
      );
    });

    return { total, pending, submitted, evaluated, avgScore, upcoming };
  }, [assignments]);

  const generateAiInsight = useCallback(async () => {
    if (loading) return;

    if (!assignments.length) {
      setAiInsight({
        summary: "No assignments available to analyze yet.",
        priority: "Low",
        actions: [
          "Enroll in courses with assignment activities.",
          "Check back after your first assignment is assigned.",
        ],
      });
      return;
    }

    const now = new Date();
    const overdueCount = assignments.filter(
      (item) => item.status === "Pending" && new Date(item.deadline) < now,
    ).length;

    const dueSoonList = stats.upcoming
      .slice(0, 3)
      .map((item) => item.title)
      .join(", ");

    const prompt = `You are an educational productivity coach.

Analyze this student's assignment snapshot and return concise actionable insight.

Data:
- Total assignments: ${stats.total}
- Pending assignments: ${stats.pending}
- Submitted assignments: ${stats.submitted}
- Evaluated assignments: ${stats.evaluated}
- Average score: ${stats.avgScore}%
- Overdue pending assignments: ${overdueCount}
- Assignments due in next 3 days: ${stats.upcoming.length}
- Due soon titles: ${dueSoonList || "N/A"}

Return ONLY valid JSON with this shape:
{
  "summary": "one short paragraph (max 40 words)",
  "priority": "Low|Medium|High",
  "actions": ["exactly 3 short next actions"]
}`;

    setAiInsightLoading(true);
    setAiInsightError("");

    try {
      const modelsRes = await api.get("/ai/models");
      const selectedModel = modelsRes?.data?.[0]?.name || "DoubtSolver";

      const aiRes = await api.post("/ai/chat", {
        modelName: selectedModel,
        message: prompt,
      });

      const responseText = aiRes?.data?.response || "";
      const parsed = parseAiInsightResponse(responseText);

      if (parsed) {
        setAiInsight(parsed);
      } else {
        setAiInsight({
          summary: responseText || "AI insight is currently unavailable.",
          priority: "Medium",
          actions: [],
        });
      }
    } catch (error) {
      console.error("Error generating assignment AI insight:", error);
      setAiInsightError("Unable to generate AI insight right now.");
    } finally {
      setAiInsightLoading(false);
    }
  }, [assignments, loading, stats]);

  useEffect(() => {
    if (loading || aiInsightRequestedRef.current) return;
    aiInsightRequestedRef.current = true;
    generateAiInsight();
  }, [loading, generateAiInsight]);

  // Filter and search assignments
  const filteredAssignments = useMemo(() => {
    let filtered = assignments;

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((a) =>
        filter === "pending"
          ? a.status === "Pending"
          : filter === "submitted"
            ? a.status === "Submitted"
            : a.status === "Evaluated",
      );
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.course.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort assignments
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "deadline") {
        return new Date(a.deadline) - new Date(b.deadline);
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "course") {
        return a.course.localeCompare(b.course);
      }
      return 0;
    });

    return filtered;
  }, [assignments, filter, searchQuery, sortBy]);

  const getStatusColor = (status) => {
    if (status === "Pending") return "bg-(--color-accent)";
    if (status === "Submitted") return "bg-(--color-warning)";
    if (status === "Evaluated") return "bg-(--color-success)";
    return "bg-(--color-danger)";
  };

  const getStatusIcon = (status) => {
    if (status === "Pending") return FiClock;
    if (status === "Submitted") return FiCheckCircle;
    if (status === "Evaluated") return FiTrendingUp;
    return FiAlertCircle;
  };

  const isUpcoming = (deadline, status) => {
    if (status !== "Pending") return false;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntil = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    return daysUntil <= 3 && daysUntil >= 0;
  };

  const isOverdue = (deadline, status) => {
    if (status !== "Pending") return false;
    return new Date(deadline) < new Date();
  };

  const getDaysUntil = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntil = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) return `${Math.abs(daysUntil)} days overdue`;
    if (daysUntil === 0) return "Due today";
    if (daysUntil === 1) return "Due tomorrow";
    return `${daysUntil} days left`;
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-(--bg-main) flex items-center justify-center">
        <LoadingWave size="w-40 h-40" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-3 md:px-16 pt-20 md:pt-32 pb-16">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {t("assignments.title")}
        </h1>
        <p className="text-(--text-secondary)">{t("assignments.subtitle")}</p>
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
              <FiFileText className="text-(--color-primary)" size={20} />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-(--color-primary)">
            {stats.total}
          </h3>
          <p className="text-xs md:text-sm text-(--text-secondary) mt-1">
            {t("assignments.stats.total")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-(--color-accent)/10 rounded-lg flex items-center justify-center">
              <FiClock className="text-(--color-accent)" size={20} />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-(--color-accent)">
            {stats.pending}
          </h3>
          <p className="text-xs md:text-sm text-(--text-secondary) mt-1">
            {t("assignments.stats.pending")}
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
              <FiCheckCircle className="text-(--color-warning)" size={20} />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-(--color-warning)">
            {stats.submitted}
          </h3>
          <p className="text-xs md:text-sm text-(--text-secondary) mt-1">
            {t("assignments.stats.submitted")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-(--color-success)/10 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="text-(--color-success)" size={20} />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-(--color-success)">
            {stats.evaluated}
          </h3>
          <p className="text-xs md:text-sm text-(--text-secondary) mt-1">
            {t("assignments.stats.evaluated")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
            {t("assignments.stats.avgScore")}
          </p>
        </motion.div>
      </div>

      {/* UPCOMING DEADLINES ALERT */}
      {stats.upcoming.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-(--color-warning)/10 border border-(--color-warning)/30 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-(--color-warning) rounded-lg flex items-center justify-center shrink-0">
              <FiAlertCircle className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">
                {t("assignments.upcoming")}
              </h3>
              <p className="text-(--text-secondary) text-sm mb-3">
                {t("assignments.upcomingCount", {
                  count: stats.upcoming.length,
                })}
              </p>
              <div className="flex flex-wrap gap-2">
                {stats.upcoming.map((assignment) => (
                  <div
                    key={assignment._id}
                    className="bg-(--card-bg) border border-(--border-color) rounded-lg px-3 py-2 text-sm"
                  >
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-xs text-(--text-secondary) mt-1">
                      <FiCalendar className="inline mr-1" size={12} />
                      {getDaysUntil(assignment.deadline)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* SEARCH AND FILTERS */}
      <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 md:p-6 mb-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FiCpu className="text-(--color-primary)" />
            {t("assignments.aiInsight.title", { defaultValue: "AI Insight" })}
          </h3>

          <button
            type="button"
            onClick={generateAiInsight}
            disabled={aiInsightLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-(--border-color) px-3 py-2 text-sm hover:bg-(--bg-muted) disabled:opacity-60"
          >
            <FiRefreshCw className={aiInsightLoading ? "animate-spin" : ""} />
            {aiInsightLoading
              ? t("assignments.aiInsight.generating", {
                  defaultValue: "Generating",
                })
              : t("assignments.aiInsight.refresh", {
                  defaultValue: "Refresh",
                })}
          </button>
        </div>

        {aiInsightLoading ? (
          <p className="text-(--text-secondary)">
            {t("assignments.aiInsight.loading", {
              defaultValue: "Analyzing your assignment workload...",
            })}
          </p>
        ) : aiInsightError ? (
          <p className="text-(--color-warning)">{aiInsightError}</p>
        ) : aiInsight ? (
          <div className="space-y-3">
            <p className="text-(--text-secondary)">{aiInsight.summary}</p>
            <p className="text-sm">
              <span className="font-semibold">
                {t("assignments.aiInsight.priority", {
                  defaultValue: "Priority",
                })}
                :
              </span>{" "}
              {aiInsight.priority}
            </p>

            {aiInsight.actions?.length > 0 ? (
              <ul className="space-y-2 text-sm text-(--text-secondary)">
                {aiInsight.actions.map((item, index) => (
                  <li key={`ai-action-${index}`} className="flex gap-2">
                    <span className="text-(--color-primary)">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <p className="text-(--text-secondary)">
            {t("assignments.aiInsight.empty", {
              defaultValue: "Generate insight to see personalized guidance.",
            })}
          </p>
        )}
      </div>

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
              placeholder={t("assignments.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-(--bg-main) border border-(--border-color) rounded-lg focus:outline-none focus:border-(--color-primary) transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "submitted", "evaluated"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  filter === type
                    ? "bg-(--color-primary) text-white"
                    : "bg-(--bg-muted) hover:bg-(--bg-muted)/70"
                }`}
              >
                {t(`assignments.filters.${type}`)}
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
              <option value="deadline">{t("assignments.sort.deadline")}</option>
              <option value="title">{t("assignments.sort.title")}</option>
              <option value="course">{t("assignments.sort.course")}</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-(--text-secondary)">
          {t("assignments.showing", {
            filtered: filteredAssignments.length,
            total: assignments.length,
          })}
        </div>
      </div>

      {/* ASSIGNMENT GRID */}
      {filteredAssignments.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-(--bg-muted) rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFileText size={32} className="text-(--text-muted)" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {t("assignments.empty.title")}
          </h3>
          <p className="text-(--text-secondary)">
            {searchQuery || filter !== "all"
              ? t("assignments.empty.adjust")
              : t("assignments.empty.none")}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment, index) => {
            const StatusIcon = getStatusIcon(assignment.status);
            const upcoming = isUpcoming(assignment.deadline, assignment.status);
            const overdue = isOverdue(assignment.deadline, assignment.status);

            return (
              <motion.div
                key={assignment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className={`bg-(--card-bg) border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all ${
                  overdue
                    ? "border-(--color-danger)"
                    : upcoming
                      ? "border-(--color-warning)"
                      : "border-(--border-color) hover:border-(--color-primary)/50"
                }`}
              >
                {/* Header with course badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      {assignment.title}
                    </h3>
                    <span className="inline-block text-xs px-3 py-1 bg-(--color-primary)/10 text-(--color-primary) rounded-full font-medium">
                      {assignment.course}
                    </span>
                  </div>
                  <StatusIcon
                    className={`shrink-0 ml-2 ${
                      assignment.status === "Pending"
                        ? "text-(--color-accent)"
                        : assignment.status === "Submitted"
                          ? "text-(--color-warning)"
                          : "text-(--color-success)"
                    }`}
                    size={24}
                  />
                </div>

                {/* Deadline Info */}
                <div className="mb-4 mt-4">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <FiCalendar className="text-(--text-muted)" size={14} />
                    <span className="text-(--text-secondary)">
                      {new Date(assignment.deadline).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>

                  {assignment.status === "Pending" && (
                    <div
                      className={`text-sm font-medium ${
                        overdue
                          ? "text-(--color-danger)"
                          : upcoming
                            ? "text-(--color-warning)"
                            : "text-(--text-secondary)"
                      }`}
                    >
                      <FiClock className="inline mr-1" size={14} />
                      {getDaysUntil(assignment.deadline)}
                    </div>
                  )}
                </div>

                {/* Status and Marks */}
                <div className="flex items-center justify-between mb-4 pt-4 border-t border-(--border-color)">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-lg font-medium ${getStatusColor(
                      assignment.status,
                    )}`}
                  >
                    <StatusIcon size={14} />
                    {assignment.status}
                  </div>

                  {assignment.marks !== null && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-(--color-success)">
                        {assignment.marks}
                      </p>
                      <p className="text-xs text-(--text-muted)">out of 100</p>
                    </div>
                  )}
                </div>

                {/* Progress bar for evaluated assignments */}
                {assignment.marks !== null && (
                  <div className="mb-4">
                    <div className="w-full bg-(--bg-muted) rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          assignment.marks >= 80
                            ? "bg-(--color-success)"
                            : assignment.marks >= 60
                              ? "bg-(--color-warning)"
                              : "bg-(--color-danger)"
                        }`}
                        style={{ width: `${assignment.marks}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() =>
                    navigate(`/student/assignments/${assignment._id}`)
                  }
                  className="w-full py-2.5 rounded-xl bg-(--color-primary) text-white font-medium hover:bg-(--color-primary-hover) transition-colors"
                >
                  {assignment.status === "Pending"
                    ? t("assignments.submit")
                    : t("assignments.view")}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Assignments;
