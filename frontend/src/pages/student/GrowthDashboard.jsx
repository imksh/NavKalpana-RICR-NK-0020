import { useEffect, useMemo, useState } from "react";
import { FiBarChart2, FiTarget, FiTrendingUp } from "react-icons/fi";
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

const GrowthDashboard = () => {
  const { t } = useTranslation();
  const [growthData, setGrowthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrowthData = async () => {
      try {
        const res = await api.get("/student/growth-dashboard");
        setGrowthData(res.data || null);
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

  const { current, weeklyTrend, moduleCompletionOverview, weeklyHistory } =
    growthData;

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
