import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiBarChart2,
  FiCpu,
  FiInfo,
  FiRefreshCw,
  FiTarget,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";
import api from "../../config/api";
import LoadingWave from "../../components/LoadingWave";

const badgeClassByColor = {
  green:
    "bg-(--color-success)/15 text-(--color-success) border border-(--color-success)/30",
  blue: "bg-(--color-primary)/15 text-(--color-primary) border border-(--color-primary)/30",
  yellow:
    "bg-(--color-warning)/15 text-(--color-warning) border border-(--color-warning)/30",
  red: "bg-(--color-danger)/15 text-(--color-danger) border border-(--color-danger)/30",
};

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

const clampPercent = (value) => Math.max(0, Math.min(100, Math.round(value)));

const GrowthDashboard = () => {
  const { t } = useTranslation();
  const [growthData, setGrowthData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState(null);
  const [aiInsightLoading, setAiInsightLoading] = useState(false);
  const [aiInsightError, setAiInsightError] = useState("");
  const aiInsightRequestedRef = useRef(false);

  useEffect(() => {
    const fetchGrowthData = async () => {
      try {
        const [growthRes, leaderboardRes] = await Promise.allSettled([
          api.get("/student/growth-dashboard"),
          api.get("/student/leaderboard"),
        ]);

        if (growthRes.status === "fulfilled") {
          setGrowthData(growthRes.value?.data || null);
        }

        if (leaderboardRes.status === "fulfilled") {
          setLeaderboard(
            Array.isArray(leaderboardRes.value?.data)
              ? leaderboardRes.value.data
              : [],
          );
        }
      } catch (error) {
        console.log("Error fetching growth dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrowthData();
  }, []);

  const badgeClass = useMemo(() => {
    const color = growthData?.current?.classification?.color || "red";
    return badgeClassByColor[color] || badgeClassByColor.red;
  }, [growthData]);

  const { current, weeklyTrend, moduleCompletionOverview, weeklyHistory } =
    growthData || {};

  const cohortAverageScore = useMemo(() => {
    if (!leaderboard?.length) return 0;
    const total = leaderboard.reduce((sum, item) => sum + (item.score || 0), 0);
    return clampPercent(total / leaderboard.length);
  }, [leaderboard]);

  const cohortDelta = useMemo(
    () => (current?.ogi || 0) - cohortAverageScore,
    [current?.ogi, cohortAverageScore],
  );

  const comparisonTrend = useMemo(
    () =>
      (weeklyTrend || []).map((item) => ({
        weekLabel: item.weekLabel,
        ogi: item.ogi,
        cohort: cohortAverageScore,
      })),
    [weeklyTrend, cohortAverageScore],
  );

  const predictionTrend = useMemo(() => {
    const trend = weeklyTrend || [];
    if (!trend.length) return [];

    const actualSeries = trend.map((item, index) => ({
      x: index,
      weekLabel: item.weekLabel,
      actualOgi: item.ogi,
      predictedOgi: null,
    }));

    const windowSize = Math.min(5, actualSeries.length);
    const sample = actualSeries.slice(-windowSize);

    let slope = 0;
    if (sample.length > 1) {
      const xAvg =
        sample.reduce((sum, item, idx) => sum + idx, 0) / sample.length;
      const yAvg =
        sample.reduce((sum, item) => sum + (item.actualOgi || 0), 0) /
        sample.length;

      const numerator = sample.reduce(
        (sum, item, idx) => sum + (idx - xAvg) * ((item.actualOgi || 0) - yAvg),
        0,
      );
      const denominator = sample.reduce(
        (sum, _, idx) => sum + (idx - xAvg) ** 2,
        0,
      );

      slope = denominator ? numerator / denominator : 0;
    }

    const lastActual = actualSeries[actualSeries.length - 1]?.actualOgi || 0;
    const nextWeek1 = clampPercent(lastActual + slope);
    const nextWeek2 = clampPercent(lastActual + slope * 2);

    return [
      ...actualSeries,
      {
        x: actualSeries.length,
        weekLabel: t("growthDashboard.prediction.nextWeek1", {
          defaultValue: "Next +1W",
        }),
        actualOgi: null,
        predictedOgi: nextWeek1,
      },
      {
        x: actualSeries.length + 1,
        weekLabel: t("growthDashboard.prediction.nextWeek2", {
          defaultValue: "Next +2W",
        }),
        actualOgi: null,
        predictedOgi: nextWeek2,
      },
    ];
  }, [weeklyTrend, t]);

  const generateAiInsight = useCallback(async () => {
    if (!growthData) return;

    const recentWeeks = (weeklyHistory || []).slice(-4);
    const recentOgi = recentWeeks.map((item) => item.ogi).join(", ");

    const prompt = `You are an academic performance coach.

Analyze this student's Overall Growth Index (OGI) snapshot and provide concise guidance.

Data:
- Current OGI: ${current?.ogi || 0}%
- Classification: ${current?.classification?.label || "Needs Attention"}
- Quiz average: ${current?.quizAverage || 0}%
- Assignment average: ${current?.assignmentAverage || 0}%
- Completion rate: ${current?.completionRate || 0}%
- Consistency: ${current?.consistency || 0}%
- Recent 4-week OGI values: ${recentOgi || "N/A"}

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
      console.log("Error generating growth AI insight:", error);
      setAiInsightError("Unable to generate AI insight right now.");
    } finally {
      setAiInsightLoading(false);
    }
  }, [growthData, weeklyHistory, current]);

  useEffect(() => {
    if (!growthData || aiInsightRequestedRef.current) return;
    aiInsightRequestedRef.current = true;
    generateAiInsight();
  }, [growthData, generateAiInsight]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <LoadingWave />
      </div>
    );
  }

  if (!growthData) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-(--text-secondary)">
        {t("growthDashboard.noData")}
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-4 md:px-10 lg:px-16 pt-10 md:pt-14 pb-16 space-y-8">
      <section className="rounded-3xl border border-(--border-color) bg-(--bg-surface) p-6 md:p-8 shadow-sm">
        <span className="inline-flex items-center gap-2 rounded-full border border-(--border-color) bg-(--bg-muted) px-3 py-1 text-xs md:text-sm text-(--text-secondary)">
          <FiBarChart2 size={14} /> {t("growthDashboard.badge")}
        </span>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold">
              {t("growthDashboard.title")}
            </h1>
            <p className="text-(--text-secondary) mt-2">
              {t("growthDashboard.subtitle")}
            </p>
          </div>

          <div className="rounded-2xl border border-(--border-color) bg-(--card-bg) px-5 py-4 text-center min-w-47.5">
            <p className="text-sm text-(--text-secondary)">
              {t("growthDashboard.currentOgi")}
            </p>
            <p className="text-3xl font-bold text-(--color-primary) mt-1">
              {current?.ogi || 0}%
            </p>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold mt-3 ${badgeClass}`}
            >
              {current?.classification?.label ||
                t("growthDashboard.needsAttention")}
            </span>
          </div>
        </div>
      </section>

      <section className="bg-(--card-bg) border border-(--border-color) rounded-3xl p-6 md:p-8">
        <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 mb-5">
          <FiTrendingUp /> {t("growthDashboard.weeklyTrend")}
        </h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTrend || []}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-color)"
              />
              <XAxis dataKey="weekLabel" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="ogi"
                name={t("growthDashboard.ogi")}
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-(--card-bg) border border-(--border-color) rounded-3xl p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
            <FiUsers />
            {t("growthDashboard.cohort.title", {
              defaultValue: "OGI vs Cohort",
            })}
          </h2>

          <p className="text-sm text-(--text-secondary)">
            {t("growthDashboard.cohort.gap", {
              defaultValue: "Current gap",
            })}
            :{" "}
            <span
              className={`font-semibold ${
                cohortDelta >= 0
                  ? "text-(--color-success)"
                  : "text-(--color-danger)"
              }`}
            >
              {cohortDelta >= 0 ? "+" : ""}
              {cohortDelta.toFixed(1)}%
            </span>
          </p>
        </div>

        <p className="text-sm text-(--text-secondary) mb-5">
          {t("growthDashboard.cohort.subtitle", {
            defaultValue:
              "Compares your weekly OGI trend with cohort average performance from leaderboard data.",
          })}
        </p>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={comparisonTrend}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-color)"
              />
              <XAxis dataKey="weekLabel" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="ogi"
                name={t("growthDashboard.cohort.you", {
                  defaultValue: "Your OGI",
                })}
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="cohort"
                name={t("growthDashboard.cohort.avg", {
                  defaultValue: "Cohort Avg",
                })}
                stroke="var(--color-accent)"
                strokeDasharray="8 6"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-(--card-bg) border border-(--border-color) rounded-3xl p-6 md:p-8">
        <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 mb-2">
          <FiTrendingUp />
          {t("growthDashboard.prediction.title", {
            defaultValue: "OGI Next 2 Weeks Prediction",
          })}
        </h2>
        <p className="text-sm text-(--text-secondary) mb-5">
          {t("growthDashboard.prediction.subtitle", {
            defaultValue:
              "Projected trend line based on your latest OGI momentum (last 5 weeks).",
          })}
        </p>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictionTrend}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-color)"
              />
              <XAxis dataKey="weekLabel" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="actualOgi"
                name={t("growthDashboard.prediction.actual", {
                  defaultValue: "Actual OGI",
                })}
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ r: 4 }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="predictedOgi"
                name={t("growthDashboard.prediction.forecast", {
                  defaultValue: "Forecast OGI",
                })}
                stroke="var(--color-warning)"
                strokeWidth={3}
                strokeDasharray="8 6"
                dot={{ r: 4 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-(--card-bg) border border-(--border-color) rounded-3xl p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
            <FiCpu />
            {t("growthDashboard.aiInsight.title", {
              defaultValue: "AI Insight",
            })}
          </h2>

          <button
            onClick={generateAiInsight}
            disabled={aiInsightLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-(--border-color) px-3 py-2 text-sm hover:bg-(--bg-muted) disabled:opacity-60"
          >
            <FiRefreshCw className={aiInsightLoading ? "animate-spin" : ""} />
            {aiInsightLoading
              ? t("growthDashboard.aiInsight.generating", {
                  defaultValue: "Generating...",
                })
              : t("growthDashboard.aiInsight.refresh", {
                  defaultValue: "Refresh Insight",
                })}
          </button>
        </div>

        {aiInsightLoading ? (
          <p className="text-sm text-(--text-secondary)">
            {t("growthDashboard.aiInsight.loading", {
              defaultValue: "Analyzing your growth pattern...",
            })}
          </p>
        ) : aiInsightError ? (
          <p className="text-sm text-(--color-warning)">{aiInsightError}</p>
        ) : aiInsight ? (
          <div className="space-y-3">
            <p className="text-(--text-secondary)">{aiInsight.summary}</p>
            <p className="text-sm">
              <span className="text-(--text-secondary)">
                {t("growthDashboard.aiInsight.priority", {
                  defaultValue: "Priority",
                })}
                :
              </span>{" "}
              <span className="font-semibold">{aiInsight.priority}</span>
            </p>
            {aiInsight.actions?.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-sm text-(--text-secondary)">
                {aiInsight.actions.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-(--text-secondary)">
            {t("growthDashboard.aiInsight.empty", {
              defaultValue: "Generate insight to see personalized guidance.",
            })}
          </p>
        )}
      </section>

      <section className="bg-(--card-bg) border border-(--border-color) rounded-3xl p-6 md:p-8">
        <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 mb-3">
          <FiInfo />
          {t("growthDashboard.ogiExplain.title", {
            defaultValue: "How OGI Works",
          })}
        </h2>

        <p className="text-(--text-secondary)">
          {t("growthDashboard.ogiExplain.body", {
            defaultValue:
              "OGI (Overall Growth Index) is your weighted academic health score from 0 to 100. It combines quiz performance, assignment performance, course completion, and submission consistency.",
          })}
        </p>

        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <div className="rounded-xl border border-(--border-color) p-3 bg-(--bg-surface)">
            <p className="text-(--text-secondary)">Quiz Weight</p>
            <p className="font-semibold">40% × {current?.quizAverage || 0}%</p>
          </div>
          <div className="rounded-xl border border-(--border-color) p-3 bg-(--bg-surface)">
            <p className="text-(--text-secondary)">Assignment Weight</p>
            <p className="font-semibold">
              30% × {current?.assignmentAverage || 0}%
            </p>
          </div>
          <div className="rounded-xl border border-(--border-color) p-3 bg-(--bg-surface)">
            <p className="text-(--text-secondary)">Completion Weight</p>
            <p className="font-semibold">
              20% × {current?.completionRate || 0}%
            </p>
          </div>
          <div className="rounded-xl border border-(--border-color) p-3 bg-(--bg-surface)">
            <p className="text-(--text-secondary)">Consistency Weight</p>
            <p className="font-semibold">10% × {current?.consistency || 0}%</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-(--text-secondary)">
          {t("growthDashboard.ogiExplain.formula", {
            defaultValue:
              "Formula: OGI = (Quiz × 0.4) + (Assignments × 0.3) + (Completion × 0.2) + (Consistency × 0.1)",
          })}
        </p>
      </section>

      <section className="bg-(--card-bg) border border-(--border-color) rounded-3xl p-6 md:p-8">
        <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 mb-5">
          <FiTarget /> {t("growthDashboard.moduleCompletion")}
        </h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moduleCompletionOverview || []}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-color)"
              />
              <XAxis dataKey="courseName" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="completionPercent"
                name={t("growthDashboard.completionRate")}
                fill="var(--color-accent)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-(--card-bg) border border-(--border-color) rounded-3xl p-6 md:p-8">
        <h2 className="text-lg md:text-xl font-semibold mb-5">
          {t("growthDashboard.weeklyHistory")}
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-(--border-color) text-(--text-secondary)">
                <th className="py-3 pr-4">{t("growthDashboard.table.week")}</th>
                <th className="py-3 pr-4">{t("growthDashboard.table.ogi")}</th>
                <th className="py-3 pr-4">{t("growthDashboard.table.quiz")}</th>
                <th className="py-3 pr-4">
                  {t("growthDashboard.table.assignment")}
                </th>
                <th className="py-3 pr-4">
                  {t("growthDashboard.table.completion")}
                </th>
                <th className="py-3 pr-4">
                  {t("growthDashboard.table.consistency")}
                </th>
                <th className="py-3 pr-4">
                  {t("growthDashboard.table.attendance")}
                </th>
              </tr>
            </thead>
            <tbody>
              {(weeklyHistory || []).map((row) => (
                <tr
                  key={row.weekStart}
                  className="border-b border-(--border-color)/60 last:border-0"
                >
                  <td className="py-3 pr-4 font-medium">{row.weekLabel}</td>
                  <td className="py-3 pr-4">{row.ogi}%</td>
                  <td className="py-3 pr-4">{row.quizAverage}%</td>
                  <td className="py-3 pr-4">{row.assignmentAverage}%</td>
                  <td className="py-3 pr-4">{row.completionRate}%</td>
                  <td className="py-3 pr-4">{row.consistency}%</td>
                  <td className="py-3 pr-4">{row.attendancePercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default GrowthDashboard;
