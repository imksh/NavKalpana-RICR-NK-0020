import {
  FiTrendingUp,
  FiCheckCircle,
  FiAward,
  FiCalendar,
  FiArrowUpRight,
  FiCpu,
  FiRefreshCw,
  FiTarget,
  FiBook,
  FiAlertCircle,
  FiList,
  FiUsers,
  FiTrendingDown,
} from "react-icons/fi";
import { FaChartBar, FaLightbulb } from "react-icons/fa";
import { SiQuizlet } from "react-icons/si";
import { useAuthStore } from "../../store/useAuthStore";
import LearningHeatmap from "../../components/student/LearningHeatmap";
import FloatingEmojis from "../../components/FloatingEmojis";
import { useStudentStore } from "../../store/useStudentStore";
import { useEffect, useCallback, useRef } from "react";
import api from "../../config/api";
import { useState } from "react";
import ActivityChart from "../../components/ActivityChart";
import EventsCalendar from "../../components/EventCalender";
import { useNavigate } from "react-router-dom";
import OverallScoreInfoModal from "../../components/student/modal/OverallScoreInfoModal";
import EventCard from "../../components/EventCard";
import LottieIcon from "../../components/LottieIcon";
import Learning from "../../assets/animations/learning.json";
import { useTranslation } from "react-i18next";

const parseAiDashboardResponse = (rawResponse) => {
  const jsonMatch = rawResponse?.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    summary: parsed.summary || rawResponse,
    thisWeek: Array.isArray(parsed.thisWeek) ? parsed.thisWeek : [],
    recommendations: Array.isArray(parsed.recommendations)
      ? parsed.recommendations
      : [],
    smartReminders: Array.isArray(parsed.smartReminders)
      ? parsed.smartReminders
      : [],
  };
};

const parseAiAdvancedResponse = (rawResponse) => {
  const jsonMatch = rawResponse?.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    prediction: parsed.prediction || rawResponse,
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    strategies: Array.isArray(parsed.strategies) ? parsed.strategies : [],
    peerComparison: parsed.peerComparison || "",
  };
};

const StudentHome = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [overallScoreInfoModalOpen, setOverallScoreInfoModalOpen] =
    useState(false);

  const navigate = useNavigate();
  const { stats, leaderboard, events, upcommingEvents, init, loading } =
    useStudentStore();
  const [activity, setActivity] = useState([]);

  // AI Dashboard states
  const [aiDashboard, setAiDashboard] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const dashboardRequestedRef = useRef(false);

  // AI Advanced Analysis states
  const [aiAdvanced, setAiAdvanced] = useState(null);
  const [aiAdvancedLoading, setAiAdvancedLoading] = useState(false);
  const [aiAdvancedError, setAiAdvancedError] = useState("");
  const advancedRequestedRef = useRef(false);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/student/learning-activity");
      setActivity(res.data.activity.slice(-7)); // Last 30 days
    };
    fetch();
  }, []);

  const generateAiDashboard = useCallback(async () => {
    if (!stats) return;

    const prompt = `You are a student success coach. Analyze this student's overall learning dashboard and provide actionable intelligence.

Data:
- Overall score: ${stats.overallScore || 0}%
- Courses enrolled: ${stats.totalCourses || 0}
- Assignments: ${stats.submittedAssignments || 0}/${stats.totalAssignments || 0} submitted
- Quizzes attempted: ${stats.attemptedQuizzes || 0}/${stats.totalQuizzes || 0}
- Skills acquired: ${stats.skillsAcquired || 0}/${stats.totalSkills || 0}
- Attendance: ${stats.attendancePercent || 0}%
- Assignment average: ${stats.avgAssignmentMarks || 0}%
- Quiz average: ${stats.avgQuizScore || 0}%
- Course completion: ${stats.courseCompletionPercent || 0}%

Return ONLY valid JSON in this exact structure:
{
  "summary": "1-2 sentence dashboard snapshot (max 40 words)",
  "thisWeek": ["Top 3 priorities for this week - specific, actionable"],
  "recommendations": ["3 study/course recommendations based on progress gaps or interests"],
  "smartReminders": ["3 time-sensitive action items - deadlines, gaps needing attention"]
}`;

    setAiLoading(true);
    setAiError("");

    try {
      const modelsRes = await api.get("/ai/models");
      const selectedModel = modelsRes?.data?.[0]?.name || "DoubtSolver";

      const aiRes = await api.post("/ai/chat", {
        modelName: selectedModel,
        message: prompt,
      });

      const responseText = aiRes?.data?.response || "";
      const parsed = parseAiDashboardResponse(responseText);

      if (parsed) {
        setAiDashboard(parsed);
      } else {
        setAiDashboard({
          summary: responseText || "AI dashboard is currently unavailable.",
          thisWeek: [],
          recommendations: [],
          smartReminders: [],
        });
      }
    } catch (error) {
      console.log("Error generating AI dashboard:", error);
      setAiError("Unable to generate dashboard insights right now.");
    } finally {
      setAiLoading(false);
    }
  }, [stats]);

  useEffect(() => {
    if (!stats || loading || dashboardRequestedRef.current) return;
    dashboardRequestedRef.current = true;
    generateAiDashboard();
  }, [stats, loading, generateAiDashboard]);

  const generateAiAdvancedAnalysis = useCallback(async () => {
    if (!stats || !leaderboard || leaderboard.length === 0) return;

    const cohortAvgScore =
      leaderboard.reduce((sum, item) => sum + (item.score || 0), 0) /
      leaderboard.length;
    const userPerformance = stats.overallScore || 0;
    const performanceGap = (userPerformance - cohortAvgScore).toFixed(1);
    const percentileRank = Math.round(
      (leaderboard.filter((item) => item.score < userPerformance).length /
        leaderboard.length) *
        100,
    );

    const prompt = `You are an advanced academic analytics AI. Provide deep performance analysis.

Student Data:
- Current score: ${userPerformance}%
- Cohort average: ${cohortAvgScore.toFixed(1)}%
- Performance gap: ${performanceGap}%
- Percentile rank: ${percentileRank}th percentile
- Courses: ${stats.totalCourses || 0}
- Assignment average: ${stats.avgAssignmentMarks || 0}%
- Quiz average: ${stats.avgQuizScore || 0}%
- Attendance: ${stats.attendancePercent || 0}%
- Course completion: ${stats.courseCompletionPercent || 0}%

Provide analysis in this JSON structure:
{
  "prediction": "1 sentence predicted final score/grade and trajectory",
  "strengths": ["3 key strengths or high-performing areas"],
  "weaknesses": ["3 areas for improvement"],
  "strategies": ["3 specific, actionable study strategies to boost performance"],
  "peerComparison": "1-2 sentences comparing student to cohort - motivational and constructive"
}`;

    setAiAdvancedLoading(true);
    setAiAdvancedError("");

    try {
      const modelsRes = await api.get("/ai/models");
      const selectedModel = modelsRes?.data?.[0]?.name || "DoubtSolver";

      const aiRes = await api.post("/ai/chat", {
        modelName: selectedModel,
        message: prompt,
      });

      const responseText = aiRes?.data?.response || "";
      const parsed = parseAiAdvancedResponse(responseText);

      if (parsed) {
        setAiAdvanced(parsed);
      } else {
        setAiAdvanced({
          prediction:
            responseText || "Advanced analysis currently unavailable.",
          strengths: [],
          weaknesses: [],
          strategies: [],
          peerComparison: "",
        });
      }
    } catch (error) {
      console.log("Error generating advanced AI analysis:", error);
      setAiAdvancedError("Unable to generate advanced analysis right now.");
    } finally {
      setAiAdvancedLoading(false);
    }
  }, [stats, leaderboard]);

  useEffect(() => {
    if (
      !stats ||
      !leaderboard ||
      leaderboard.length === 0 ||
      loading ||
      advancedRequestedRef.current
    )
      return;
    advancedRequestedRef.current = true;
    generateAiAdvancedAnalysis();
  }, [stats, leaderboard, loading, generateAiAdvancedAnalysis]);

  const getPersonalGreeting = (name = "") => {
    const hour = new Date().getHours();

    let greeting;

    if (hour < 12) greeting = t("studentHome.greetings.morning");
    else if (hour < 17) greeting = t("studentHome.greetings.afternoon");
    else if (hour < 21) greeting = t("studentHome.greetings.evening");
    else greeting = t("studentHome.greetings.night");

    return `${greeting}${name ? `, ${name}` : ""}`;
  };

  const getOgiBadge = (ogi = 0) => {
    if (ogi >= 85)
      return {
        label: "Excellent",
        className:
          "bg-(--color-success)/15 text-(--color-success) border border-(--color-success)/30",
      };
    if (ogi >= 70)
      return {
        label: "Improving",
        className:
          "bg-(--color-primary)/15 text-(--color-primary) border border-(--color-primary)/30",
      };
    if (ogi >= 50)
      return {
        label: "Stable",
        className:
          "bg-(--color-warning)/15 text-(--color-warning) border border-(--color-warning)/30",
      };
    return {
      label: "Needs Attention",
      className:
        "bg-(--color-danger)/15 text-(--color-danger) border border-(--color-danger)/30",
    };
  };

  const ogiBadge = getOgiBadge(stats.overallScore || 0);

  return (
    <>
      <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-3 md:px-10 lg:px-16 pt-8 md:pt-12 pb-16">
        <section className="mb-8 md:mb-10 rounded-3xl border border-(--border-color) bg-(--bg-surface) px-5 py-6 md:px-8 md:py-8 shadow-sm">
          <div className="flex items-start gap-4 md:gap-6">
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-(--border-color) bg-(--bg-muted) px-3 py-1 text-xs md:text-sm text-(--text-secondary)">
                <FiTrendingUp size={14} /> {t("studentHome.badge")}
              </span>
              <h1 className="mt-3 text-2xl md:text-4xl font-semibold leading-tight flex  items-center gap-1.5">
                {getPersonalGreeting(user.name)} <FloatingEmojis />
              </h1>
              <p className="text-(--text-secondary) mt-2 text-sm md:text-base max-w-2xl">
                {t("studentHome.subtitle")}
              </p>
            </div>

            <div className="hidden md:block">
              <div className="rounded-2xl border border-(--border-color) bg-(--card-bg) px-3 py-2">
                <LottieIcon animation={Learning} className="w-34 lg:w-40" />
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5 mb-8 md:mb-10">
          <StatCard
            icon={<FiTrendingUp />}
            title={t("studentHome.stats.overallScore")}
            value={`${stats.overallScore || 0}%`}
            badge={ogiBadge}
            color="text-(--color-primary)"
            onClick={() => setOverallScoreInfoModalOpen(true)}
            loading={loading}
          />

          <StatCard
            icon={<FiCheckCircle />}
            title={t("studentHome.stats.assignments")}
            value={`${stats.submittedAssignments || 0} / ${stats.totalAssignments || 0}`}
            color="text-(--color-success)"
            onClick={() => navigate("/student/assignments")}
            loading={loading}
          />

          <StatCard
            icon={<FiAward />}
            title={t("studentHome.stats.skills")}
            value={`${stats.skillsAcquired || 0} / ${stats.totalSkills || 0}`}
            color="text-(--color-accent)"
            onClick={() => navigate("/student/courses")}
            loading={loading}
          />

          <StatCard
            icon={<SiQuizlet />}
            title={t("studentHome.stats.quizzes")}
            value={`${stats.attemptedQuizzes || 0} / ${stats.totalQuizzes || 0}`}
            color="text-(--color-warning)"
            onClick={() => navigate("/student/quizzes")}
            loading={loading}
          />

          <StatCard
            icon={<FaChartBar />}
            title={t("studentHome.stats.growthDashboard")}
            value={t("studentHome.stats.open")}
            color="text-(--color-accent)"
            onClick={() => navigate("/student/growth-dashboard")}
            loading={loading}
          />
        </section>

        <section className="mb-8 md:mb-10 rounded-3xl border border-(--border-color) bg-(--bg-surface) p-3 md:p-5 shadow-sm">
          <SectionHeader
            title={t("studentHome.learningConsistency.title")}
            subtitle={t("studentHome.learningConsistency.subtitle")}
          />
          <LearningHeatmap />
        </section>

        <section className="mb-8 md:mb-10 bg-(--card-bg) border border-(--border-color) p-6 md:p-8 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <FiCpu />
              {t("studentHome.aiDashboard.title", {
                defaultValue: "AI Dashboard Intelligence",
              })}
            </h2>

            <button
              type="button"
              onClick={generateAiDashboard}
              disabled={aiLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-(--border-color) px-3 py-2 text-sm hover:bg-(--bg-muted) disabled:opacity-60"
            >
              <FiRefreshCw className={aiLoading ? "animate-spin" : ""} />
              <span className="hidden sm:block">
                {aiLoading
                  ? t("studentHome.generating", { defaultValue: "Generating" })
                  : t("studentHome.regenerate", { defaultValue: "Regenerate" })}
              </span>
            </button>
          </div>

          {aiLoading ? (
            <p className="text-(--text-secondary)">
              {t("studentHome.analyzingDashboard", {
                defaultValue:
                  "Analyzing your learning journey and generating insights...",
              })}
            </p>
          ) : aiError ? (
            <p className="text-(--color-warning)">{aiError}</p>
          ) : aiDashboard ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-(--text-primary)">
                  {t("studentHome.summary", {
                    defaultValue: "Dashboard Summary",
                  })}
                </h3>
                <p className="text-(--text-secondary)">{aiDashboard.summary}</p>
              </div>

              <AiInsightList
                icon={<FiTarget className="text-(--color-primary)" />}
                title={t("studentHome.thisWeek", {
                  defaultValue: "This Week's Focus",
                })}
                items={aiDashboard.thisWeek}
              />

              <AiInsightList
                icon={<FiBook className="text-(--color-accent)" />}
                title={t("studentHome.recommendations", {
                  defaultValue: "Study Recommendations",
                })}
                items={aiDashboard.recommendations}
              />

              <AiInsightList
                icon={<FiAlertCircle className="text-(--color-warning)" />}
                title={t("studentHome.smartReminders", {
                  defaultValue: "Smart Reminders",
                })}
                items={aiDashboard.smartReminders}
              />
            </div>
          ) : (
            <p className="text-(--text-secondary)">
              {t("studentHome.aiEmpty", {
                defaultValue:
                  "Generate AI insights to see your personalized dashboard.",
              })}
            </p>
          )}
        </section>

        <section className="grid md:grid-cols-2 gap-5 md:gap-6 mb-8 md:mb-10">
          <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-3 md:p-5 shadow-sm flex flex-col">
            <SectionHeader
              title={t("studentHome.weeklyActivity.title")}
              subtitle={t("studentHome.weeklyActivity.subtitle")}
            />
            <div className="h-48 w-full flex items-center justify-center text-(--text-muted) m-auto">
              <ActivityChart data={activity} />
            </div>
          </div>

          <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-3 md:p-5 shadow-sm">
            <SectionHeader
              title={t("studentHome.eventsCalendar.title")}
              subtitle={t("studentHome.eventsCalendar.subtitle")}
            />
            <EventsCalendar events={events} />
          </div>
        </section>

        <section className="mb-8 md:mb-10">
          <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 md:p-6 shadow-sm">
            <SectionHeader
              icon={<FiCalendar size={16} />}
              title={t("studentHome.upcomingEvents.title")}
              subtitle={t("studentHome.upcomingEvents.subtitle")}
            />
            <EventCard upcommingEvents={upcommingEvents} />
          </div>
        </section>

        <section className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 md:p-6 shadow-sm mb-8 md:mb-10">
          <SectionHeader
            title={t("studentHome.leaderboard.title")}
            subtitle={t("studentHome.leaderboard.subtitle")}
          />

          <div className="space-y-4 ">
            {leaderboard.map((item, index) => (
              <LeaderboardItem
                key={index}
                rank={item.rank}
                name={item._id === user._id ? `${item.name} (You)` : item.name}
                photo={item.photo}
                score={item.score}
                highlight={item._id === user._id}
              />
            ))}
          </div>
        </section>

        <section className="mb-8 md:mb-10 bg-(--card-bg) border border-(--border-color) p-6 md:p-8 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <FaChartBar />
              {t("studentHome.aiAdvanced.title", {
                defaultValue: "Performance Analysis & Strategies",
              })}
            </h2>

            <button
              type="button"
              onClick={generateAiAdvancedAnalysis}
              disabled={aiAdvancedLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-(--border-color) px-3 py-2 text-sm hover:bg-(--bg-muted) disabled:opacity-60"
            >
              <FiRefreshCw
                className={aiAdvancedLoading ? "animate-spin" : ""}
              />
              <span className="hidden sm:block">
                {aiAdvancedLoading
                  ? t("studentHome.generating", { defaultValue: "Generating" })
                  : t("studentHome.regenerate", { defaultValue: "Regenerate" })}
              </span>
            </button>
          </div>

          {aiAdvancedLoading ? (
            <p className="text-(--text-secondary)">
              {t("studentHome.analyzingPerformance", {
                defaultValue:
                  "Analyzing your performance and generating insights...",
              })}
            </p>
          ) : aiAdvancedError ? (
            <p className="text-(--color-warning)">{aiAdvancedError}</p>
          ) : aiAdvanced ? (
            <div className="space-y-6">
              <div className="bg-(--bg-muted) rounded-xl p-4 border border-(--border-color)">
                <h3 className="text-sm font-semibold mb-2 text-(--text-primary) flex items-center gap-2">
                  <FiTrendingUp size={16} /> Prediction
                </h3>
                <p className="text-(--text-secondary)">
                  {aiAdvanced.prediction}
                </p>
              </div>

              <div className="bg-(--bg-muted) rounded-xl p-4 border border-(--border-color)">
                <h3 className="text-sm font-semibold mb-2 text-(--text-primary) flex items-center gap-2">
                  <FiUsers size={16} /> Peer Comparison
                </h3>
                <p className="text-(--text-secondary)">
                  {aiAdvanced.peerComparison}
                </p>
              </div>

              <AiInsightList
                icon={<FiCheckCircle className="text-(--color-success)" />}
                title={t("studentHome.strengths", {
                  defaultValue: "Strengths",
                })}
                items={aiAdvanced.strengths}
              />

              <AiInsightList
                icon={<FiTrendingDown className="text-(--color-warning)" />}
                title={t("studentHome.weaknesses", {
                  defaultValue: "Areas for Improvement",
                })}
                items={aiAdvanced.weaknesses}
              />

              <AiInsightList
                icon={<FaLightbulb className="text-(--color-accent)" />}
                title={t("studentHome.strategies", {
                  defaultValue: "Study Strategies",
                })}
                items={aiAdvanced.strategies}
              />
            </div>
          ) : (
            <p className="text-(--text-secondary)">
              {t("studentHome.aiAdvancedEmpty", {
                defaultValue:
                  "Generate performance analysis to unlock deeper insights.",
              })}
            </p>
          )}
        </section>
      </div>
      {/* ================= OVERALL SCORE INFO MODAL ================= */}
      <OverallScoreInfoModal
        isOpen={overallScoreInfoModalOpen}
        onClose={() => setOverallScoreInfoModalOpen(false)}
        avgAssignmentMarks={stats.avgAssignmentMarks}
        avgQuizScore={stats.avgQuizScore}
        consistencyPercent={stats.consistencyPercent}
        courseCompletionPercent={stats.courseCompletionPercent}
        overallScore={stats.overallScore}
      />
    </>
  );
};

/* ================= COMPONENTS ================= */

const AiInsightList = ({ icon, title, items }) => (
  <div>
    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
      {icon}
      {title}
    </h3>
    {items?.length ? (
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className="text-sm text-(--text-secondary) flex gap-3 items-start"
          >
            <span className="text-(--color-primary) mt-0.5 font-bold">
              {index + 1}.
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-(--text-muted)">{title}: Not available</p>
    )}
  </div>
);

const StatCard = ({ icon, title, value, color, onClick, loading, badge }) => (
  <div
    onClick={!loading ? onClick : undefined}
    className={`bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 md:p-5 shadow-sm ${
      !loading ? "cursor-pointer hover:shadow-md" : "cursor-default"
    } transition flex flex-col items-start`}
  >
    {loading ? (
      <>
        <div className="w-full flex items-start justify-between gap-2">
          <div className="w-8 h-8 mb-3 bg-(--bg-muted) rounded-lg animate-pulse"></div>
          <div className="w-4 h-4 bg-(--bg-muted) rounded animate-pulse"></div>
        </div>
        <div className="w-20 h-3 bg-(--bg-muted) rounded mb-2 animate-pulse"></div>
        <div className="w-16 h-6 bg-(--bg-muted) rounded animate-pulse"></div>
      </>
    ) : (
      <>
        <div className="w-full flex items-start justify-between gap-2">
          <div className={`text-2xl mb-3 ${color}`}>{icon}</div>
          <span className="text-(--text-muted)">
            <FiArrowUpRight size={16} />
          </span>
        </div>
        <h4 className="text-(--text-secondary) text-xs md:text-sm mb-1">
          {title}
        </h4>
        <p className="text-xl md:text-2xl font-semibold leading-tight">
          {value}
        </p>
        {badge ? (
          <span
            className={`mt-2 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge.className}`}
          >
            {badge.label}
          </span>
        ) : null}
      </>
    )}
  </div>
);

const SectionHeader = ({ title, subtitle, icon }) => (
  <div className="mb-4 md:mb-5">
    <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
      {icon ? <span className="text-(--color-primary)">{icon}</span> : null}
      {title}
    </h3>
    {subtitle ? (
      <p className="text-(--text-secondary) mt-1 text-sm">{subtitle}</p>
    ) : null}
  </div>
);

const LeaderboardItem = ({ rank, name, score, highlight, photo }) => (
  <div
    className={`flex justify-between items-center px-3 md:px-4 py-3 rounded-xl border border-transparent ${
      highlight ? "bg-(--bg-muted)" : "bg-transparent"
    }`}
  >
    <div className="flex items-center space-x-3">
      <span className="font-bold">{rank}.</span>
      <img
        src={photo?.url || "/default-avatar.png"}
        alt={name}
        className="w-8 h-8 rounded-full object-cover"
      />
      <span className="font-medium">
        {name?.slice(0, 20)}
        {name?.length > 20 ? "..." : ""}
      </span>
    </div>
    <span className="text-(--color-success) font-semibold">{score}%</span>
  </div>
);

export default StudentHome;
