import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AttendanceHeatmap from "../../components/student/AttendanceHeatmap";
import api from "../../config/api";
import { FaDownload } from "react-icons/fa6";
import AttendanceCalendar from "../../components/AttendanceCalender";
import CourseAttendanceChart from "../../components/CourseAttendanceChart";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiCpu,
  FiRefreshCw,
  FiTrendingUp,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import LoadingWave from "../../components/LoadingWave";

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

const StudentAttendance = () => {
  const { t } = useTranslation();
  const [attendanceData, setAttendanceData] = useState([]);
  const [courseAttendance, setCourseAttendance] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState(null);
  const [aiInsightLoading, setAiInsightLoading] = useState(false);
  const [aiInsightError, setAiInsightError] = useState("");
  const aiInsightRequestedRef = useRef(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get("/student/attendance");

        setAttendanceData(res.data.dailyAttendance || []);
        setCourseAttendance(res.data.courseAttendance || []);
        setStreak(res.data.streak || 0);
      } catch (error) {
        console.log("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const attendanceByCourse = useMemo(() => {
    const map = {};

    attendanceData.forEach((item) => {
      if (!map[item.courseId]) {
        map[item.courseId] = [];
      }
      map[item.courseId].push(item);
    });

    return map;
  }, [attendanceData]);

  const totalClasses = attendanceData?.length || 0;

  const presentDays = useMemo(() => {
    return attendanceData.filter((a) => a.status === "Present").length;
  }, [attendanceData]);

  const attendancePercent = totalClasses
    ? Math.round((presentDays / totalClasses) * 100)
    : 0;

  const generateAiInsight = useCallback(async () => {
    if (loading) return;

    if (!attendanceData.length) {
      setAiInsight({
        summary: "No attendance records available to analyze yet.",
        priority: "Low",
        actions: [
          "Attend upcoming classes consistently this week.",
          "Track attendance after each class session.",
          "Review your timetable daily to avoid missed classes.",
        ],
      });
      return;
    }

    const absentDays = Math.max(0, totalClasses - presentDays);
    const weakCourses = courseAttendance
      .filter((course) => (course.percent || 0) < 75)
      .map((course) => `${course.name} (${course.percent || 0}%)`)
      .slice(0, 3)
      .join(", ");

    const prompt = `You are an academic attendance coach.

Analyze this student's attendance snapshot and provide concise guidance.

Data:
- Total classes: ${totalClasses}
- Present classes: ${presentDays}
- Absent classes: ${absentDays}
- Overall attendance: ${attendancePercent}%
- Current streak: ${streak} days
- Courses tracked: ${courseAttendance.length}
- Courses below 75% attendance: ${weakCourses || "None"}

Return ONLY valid JSON with this shape:
{
  "summary": "one short paragraph (max 40 words)",
  "priority": "Low|Medium|High",
  "actions": ["exactly 3 short next actions"]
}

Consistency rules:
- If overall attendance is 80% or above, do NOT describe attendance as low.
- If overall attendance is below 75%, treat it as at-risk and mention improvement urgency.`;

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
        const hasLowAttendanceLabel =
          /low attendance|poor attendance|at-risk attendance/i.test(
            parsed.summary || "",
          );

        if (attendancePercent >= 80 && hasLowAttendanceLabel) {
          setAiInsight({
            summary:
              "Your attendance is in a healthy range overall. Focus on consistency to maintain momentum and strengthen any specific course where attendance is relatively lower.",
            priority: "Low",
            actions:
              parsed.actions?.length === 3
                ? parsed.actions
                : [
                    "Maintain your current class attendance consistency this week.",
                    "Prioritize classes in courses with lower attendance percentages.",
                    "Review your weekly timetable nightly to avoid accidental misses.",
                  ],
          });
        } else {
          setAiInsight(parsed);
        }
      } else {
        setAiInsight({
          summary: responseText || "AI insight is currently unavailable.",
          priority: "Medium",
          actions: [],
        });
      }
    } catch (error) {
      console.log("Error generating attendance AI insight:", error);
      setAiInsightError("Unable to generate AI insight right now.");
    } finally {
      setAiInsightLoading(false);
    }
  }, [
    loading,
    attendanceData,
    totalClasses,
    presentDays,
    attendancePercent,
    streak,
    courseAttendance,
  ]);

  useEffect(() => {
    if (loading || aiInsightRequestedRef.current) return;
    aiInsightRequestedRef.current = true;
    generateAiInsight();
  }, [loading, generateAiInsight]);

  const handleReportDonwnload = async (query) => {
    try {
      const res = await api.get("/student/attendance/report", {
        responseType: "blob",
        params: query,
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendance_report.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log("Error downloading report:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <LoadingWave />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-3 md:px-10 lg:px-16 pt-12 md:pt-16 pb-20">
      <section className="rounded-3xl border border-(--border-color) bg-(--bg-surface) p-5 md:p-8 shadow-sm mb-8 md:mb-10">
        <div className="grid gap-4 md:flex justify-between items-start md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-(--border-color) bg-(--bg-muted) px-3 py-1 text-xs md:text-sm text-(--text-secondary)">
              <FiTrendingUp size={14} /> {t("studentAttendance.badge")}
            </span>
            <h1 className="text-2xl md:text-4xl font-semibold mt-3 mb-2">
              {t("studentAttendance.title")}
            </h1>
            <p className="text-sm md:text-base text-(--text-secondary)">
              {t("studentAttendance.subtitle")}
            </p>
          </div>

          <button
            className="px-4 py-3 bg-(--color-primary) text-white rounded-xl hover:bg-(--color-secondary) transition cursor-pointer w-fit"
            onClick={() => handleReportDonwnload({ course: null })}
          >
            <FaDownload className="inline mr-2" />
            {t("studentAttendance.download")}
          </button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
        <SummaryCard
          title={t("studentAttendance.cards.overall")}
          value={`${attendancePercent}%`}
          subtitle={t("studentAttendance.cards.overallSub")}
          tone={attendancePercent >= 75 ? "good" : "danger"}
          progress={attendancePercent}
        />

        <SummaryCard
          title={t("studentAttendance.cards.present")}
          value={presentDays}
          subtitle={t("studentAttendance.cards.presentSub", {
            total: totalClasses,
          })}
          tone="neutral"
        />

        <SummaryCard
          title={t("studentAttendance.cards.streak")}
          value={`🔥 ${streak} Days`}
          subtitle={t("studentAttendance.cards.streakSub")}
          tone="accent"
        />
      </section>

      <section className="mb-8 md:mb-10 rounded-3xl border border-(--border-color) bg-(--card-bg) p-5 md:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
            <FiCpu className="text-(--color-primary)" />
            {t("studentAttendance.aiInsight.title", {
              defaultValue: "AI Insight",
            })}
          </h2>

          <button
            type="button"
            onClick={generateAiInsight}
            disabled={aiInsightLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-(--border-color) px-3 py-2 text-sm hover:bg-(--bg-muted) disabled:opacity-60"
          >
            <FiRefreshCw className={aiInsightLoading ? "animate-spin" : ""} />
            {aiInsightLoading
              ? t("studentAttendance.aiInsight.generating", {
                  defaultValue: "Generating",
                })
              : t("studentAttendance.aiInsight.refresh", {
                  defaultValue: "Refresh",
                })}
          </button>
        </div>

        {aiInsightLoading ? (
          <p className="text-(--text-secondary)">
            {t("studentAttendance.aiInsight.loading", {
              defaultValue: "Analyzing your attendance trends...",
            })}
          </p>
        ) : aiInsightError ? (
          <p className="text-(--color-warning)">{aiInsightError}</p>
        ) : aiInsight ? (
          <div className="space-y-3">
            <p className="text-(--text-secondary)">{aiInsight.summary}</p>
            <p className="text-sm">
              <span className="font-semibold">
                {t("studentAttendance.aiInsight.priority", {
                  defaultValue: "Priority",
                })}
                :
              </span>{" "}
              {aiInsight.priority}
            </p>

            {aiInsight.actions?.length > 0 ? (
              <ul className="space-y-2 text-sm text-(--text-secondary)">
                {aiInsight.actions.map((item, index) => (
                  <li
                    key={`attendance-ai-action-${index}`}
                    className="flex gap-2"
                  >
                    <span className="text-(--color-primary)">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <p className="text-(--text-secondary)">
            {t("studentAttendance.aiInsight.empty", {
              defaultValue:
                "Generate insight to see personalized attendance guidance.",
            })}
          </p>
        )}
      </section>

      {attendancePercent > 0 && attendancePercent < 75 && (
        <div className="mb-8 md:mb-10 rounded-xl border border-(--color-danger) bg-(--card-bg) p-4 text-(--text-primary) flex items-start gap-3">
          <FiAlertTriangle className="text-(--color-danger) mt-0.5" />
          <div>
            <p className="font-medium">Attendance below 75%</p>
            <p className="text-sm text-(--text-secondary)">
              {t("studentAttendance.alert")}
            </p>
          </div>
        </div>
      )}

      <section className="grid md:grid-cols-2 gap-5 md:gap-6 mb-8 md:mb-10">
        <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-3 md:p-5 shadow-sm flex flex-col">
          <SectionHeader
            title={t("studentAttendance.weekly.title")}
            subtitle={t("studentAttendance.weekly.subtitle")}
          />
          <div className="h-48 w-full flex items-center justify-center text-(--text-muted) m-auto">
            <CourseAttendanceChart attendance={attendanceData} />
          </div>
        </div>

        <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-3 md:p-5 shadow-sm">
          <SectionHeader
            title={t("studentAttendance.calendar.title")}
            subtitle={t("studentAttendance.calendar.subtitle")}
          />
          <AttendanceCalendar attendance={attendanceData} />
        </div>
      </section>

      <section className="mb-10 rounded-3xl border border-(--border-color) bg-(--bg-surface) p-3 md:p-5 shadow-sm">
        <SectionHeader
          title={t("studentAttendance.heatmap.title")}
          subtitle={t("studentAttendance.heatmap.subtitle")}
        />
        <AttendanceHeatmap data={attendanceData} />
      </section>

      <section>
        <SectionHeader
          title={t("studentAttendance.byCourse.title")}
          subtitle={t("studentAttendance.byCourse.subtitle")}
        />

        {courseAttendance.length === 0 ? (
          <p className="text-(--text-secondary)">
            {t("studentAttendance.noData")}
          </p>
        ) : (
          <div className="space-y-8 md:space-y-10">
            {courseAttendance.map((course) => {
              const courseData = attendanceByCourse[course._id] || [];

              const total = courseData.length;
              const present = courseData.filter(
                (a) => a.status === "Present",
              ).length;

              const percent = total ? Math.round((present / total) * 100) : 0;

              return (
                <div
                  key={course._id}
                  className="bg-(--card-bg) border border-(--border-color) rounded-3xl px-3 py-5 sm:p-6 shadow-sm"
                >
                  <div className="grid gap-4 md:flex md:justify-between md:items-center mb-6 w-full">
                    <div>
                      <h3 className="text-lg font-semibold">{course.name}</h3>
                      <p className="text-sm text-(--text-secondary)">
                        {t("studentAttendance.attendancePercent", {
                          percent,
                        })}
                      </p>
                    </div>

                    <button
                      className="px-4 py-2.5 bg-(--color-primary) text-white rounded-xl hover:bg-(--color-secondary) transition cursor-pointer w-fit ml-auto"
                      onClick={() =>
                        handleReportDonwnload({ course: course._id })
                      }
                    >
                      <FaDownload className="inline mr-2" />
                      {t("studentAttendance.download")}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    <div className="rounded-2xl border border-(--border-color) p-3 md:p-4">
                      <CourseAttendanceChart attendance={courseData} />
                    </div>
                    <div className="rounded-2xl border border-(--border-color) p-3 md:p-4">
                      <AttendanceCalendar attendance={courseData} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4 md:mb-5">
    <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
    {subtitle ? (
      <p className="text-sm text-(--text-secondary) mt-1">{subtitle}</p>
    ) : null}
  </div>
);

const SummaryCard = ({ title, value, subtitle, tone, progress }) => (
  <div className="bg-(--card-bg) border border-(--border-color) p-5 md:p-6 rounded-3xl shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between gap-3 mb-2">
      <h3 className="text-sm text-(--text-secondary)">{title}</h3>
      {tone === "good" ? (
        <FiCheckCircle className="text-(--color-success)" />
      ) : tone === "danger" ? (
        <FiAlertTriangle className="text-(--color-danger)" />
      ) : null}
    </div>

    <p
      className={`text-3xl font-bold ${
        tone === "accent"
          ? "text-(--color-primary)"
          : tone === "danger"
            ? "text-(--color-danger)"
            : ""
      }`}
    >
      {value}
    </p>
    <p className="text-(--text-secondary) text-sm mt-2">{subtitle}</p>

    {typeof progress === "number" ? (
      <div className="w-full h-2 bg-(--bg-muted) rounded-full mt-4 overflow-hidden">
        <div
          className={`h-2 rounded-full ${
            progress >= 75 ? "bg-(--color-success)" : "bg-(--color-danger)"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    ) : null}
  </div>
);

export default StudentAttendance;
