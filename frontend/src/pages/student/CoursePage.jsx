import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  FiBookOpen,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiCpu,
  FiPlayCircle,
  FiRefreshCw,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../config/api";
import useUiStore from "../../store/useUiStore";
import Loading from "../../components/Loading";
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

const CoursePage = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useUiStore();

  const [course, setCourse] = useState(location.state || null);
  const [modules, setModules] = useState([]);
  const [openModule, setOpenModule] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingModules, setLoadingModules] = useState(true);
  const [aiInsight, setAiInsight] = useState(null);
  const [aiInsightLoading, setAiInsightLoading] = useState(false);
  const [aiInsightError, setAiInsightError] = useState("");
  const aiInsightRequestedRef = useRef(false);

  /* ================= FETCH COURSE ================= */
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!course) {
          const res = await api.get(`/course/${slug}`);
          setCourse(res.data);
        }
      } catch (error) {
        console.log("Error fetching course:", error);
      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourse();
  }, [slug, location.pathname, course]);

  /* ================= FETCH MODULES ================= */
  useEffect(() => {
    if (!course?._id) return;

    const fetchModules = async () => {
      try {
        const res = await api.get(`/course/${course._id}/modules`);
        setModules(res.data);

        // auto-open first module
        if (res.data.length > 0) {
          setOpenModule(res.data[0]._id);
        }
      } catch (error) {
        console.log("Error fetching modules:", error);
      } finally {
        setLoadingModules(false);
      }
    };

    fetchModules();
  }, [course?._id]);

  const allLessons = useMemo(
    () => modules.flatMap((module) => module.lessons || []),
    [modules],
  );

  const completedLessons = useMemo(
    () => allLessons.filter((lesson) => lesson.isCompleted).length,
    [allLessons],
  );

  const totalLessons = allLessons.length;

  const totalDurationMinutes = useMemo(
    () =>
      allLessons.reduce(
        (sum, lesson) => sum + (lesson.estimatedDurationMinutes || 0),
        0,
      ),
    [allLessons],
  );

  const nextLesson = useMemo(
    () => allLessons.find((lesson) => !lesson.isCompleted) || null,
    [allLessons],
  );

  const completionRatio = totalLessons
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  const generateAiInsight = useCallback(async () => {
    if (loadingCourse || loadingModules || !course) return;

    const courseTitle = course?.title?.[lang] || course?.title?.en || "Course";
    const attendancePercent = course?.attendancePercent || 0;
    const progressPercent = course?.progress || 0;

    const prompt = `You are an academic course coach.

Analyze this student's single-course learning snapshot and return concise actionable insight.

Data:
- Course: ${courseTitle}
- Course progress: ${progressPercent}%
- Attendance: ${attendancePercent}%
- Completed lessons: ${completedLessons}
- Total lessons: ${totalLessons}
- Module completion ratio: ${completionRatio}%
- Modules: ${modules.length}
- Next lesson pending: ${nextLesson ? "Yes" : "No"}
- Next lesson duration: ${nextLesson?.estimatedDurationMinutes || 0} minutes

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
      console.log("Error generating course-page AI insight:", error);
      setAiInsightError("Unable to generate AI insight right now.");
    } finally {
      setAiInsightLoading(false);
    }
  }, [
    loadingCourse,
    loadingModules,
    course,
    lang,
    completedLessons,
    totalLessons,
    completionRatio,
    modules.length,
    nextLesson,
  ]);

  useEffect(() => {
    if (loadingCourse || loadingModules || aiInsightRequestedRef.current)
      return;
    aiInsightRequestedRef.current = true;
    generateAiInsight();
  }, [loadingCourse, loadingModules, generateAiInsight]);

  if (loadingCourse) return <LoadingWave />;

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-4 md:px-10 lg:px-16 pt-10 md:pt-14 pb-16 space-y-8">
      <section className="rounded-3xl border border-(--border-color) bg-(--bg-surface) p-6 md:p-8 shadow-sm">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-(--border-color) bg-(--bg-muted) px-3 py-1 text-xs md:text-sm text-(--text-secondary)">
              <FiBookOpen size={14} /> {t("coursePage.badge")}
            </span>

            <h1 className="text-3xl md:text-4xl font-semibold mt-4 leading-tight">
              {course?.title?.[lang] || course?.title?.en}
            </h1>

            <p className="mt-3 text-(--text-secondary)">
              {course?.description?.[lang] || course?.description?.en}
            </p>

            <div className="mt-4 text-sm text-(--text-secondary) inline-flex items-center gap-2">
              <FiUser size={14} />
              <span>{course?.instructor?.name || t("common.na")}</span>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm mb-1">
                <span>{t("coursePage.progress")}</span>
                <span>{course?.progress || 0}%</span>
              </div>

              <div className="w-full h-3 bg-(--bg-muted) rounded-full overflow-hidden">
                <div
                  className="h-3 bg-(--color-primary) rounded-full transition-all"
                  style={{ width: `${course?.progress || 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3">
            <StatCard
              icon={<FiTrendingUp size={14} />}
              label={t("coursePage.attendance")}
              value={`${course?.attendancePercent || 0}%`}
            />
            <StatCard
              icon={<FiCheckCircle size={14} />}
              label={t("coursePage.completedLessons")}
              value={`${completedLessons}/${totalLessons || 0}`}
            />
            <StatCard
              icon={<FiClock size={14} />}
              label={t("coursePage.estimatedDuration")}
              value={`${totalDurationMinutes} min`}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mt-5">
          <MiniInsight
            title={t("coursePage.moduleCompletion")}
            value={`${completionRatio}%`}
            subtitle={t("coursePage.moduleCompletionSub")}
          />
          <MiniInsight
            title={t("coursePage.totalModules")}
            value={modules.length}
            subtitle={t("coursePage.totalModulesSub")}
          />
          <MiniInsight
            title={t("coursePage.skills")}
            value={course?.skills?.length || 0}
            subtitle={t("coursePage.skillsSub")}
          />
        </div>

        {nextLesson ? (
          <button
            onClick={() =>
              navigate(
                `/student/courses/${slug}/${nextLesson.slug || nextLesson._id}`,
              )
            }
            className="mt-5 w-full md:w-auto rounded-xl border border-(--border-color) bg-(--card-bg) px-4 py-3 text-left hover:bg-(--bg-muted) cursor-pointer transition-all"
          >
            <p className="text-xs text-(--text-secondary) mb-1">
              {t("coursePage.upNext")}
            </p>
            <p className="font-medium line-clamp-2">
              {nextLesson.title?.[lang] || nextLesson.title}
            </p>
            <p className="text-xs text-(--text-secondary) mt-1 inline-flex items-center gap-1">
              <FiPlayCircle size={12} />{" "}
              {nextLesson.estimatedDurationMinutes || 0} min
            </p>
          </button>
        ) : null}
      </section>

      <section className="rounded-3xl border border-(--border-color) bg-(--card-bg) p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
            <FiCpu className="text-(--color-primary)" />
            {t("coursePage.aiInsight.title", { defaultValue: "AI Insight" })}
          </h2>

          <button
            type="button"
            onClick={generateAiInsight}
            disabled={aiInsightLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-(--border-color) px-3 py-2 text-sm hover:bg-(--bg-muted) disabled:opacity-60"
          >
            <FiRefreshCw className={aiInsightLoading ? "animate-spin" : ""} />
            {aiInsightLoading
              ? t("coursePage.aiInsight.generating", {
                  defaultValue: "Generating",
                })
              : t("coursePage.aiInsight.refresh", {
                  defaultValue: "Refresh",
                })}
          </button>
        </div>

        {aiInsightLoading ? (
          <p className="text-(--text-secondary)">
            {t("coursePage.aiInsight.loading", {
              defaultValue: "Analyzing your course learning status...",
            })}
          </p>
        ) : aiInsightError ? (
          <p className="text-(--color-warning)">{aiInsightError}</p>
        ) : aiInsight ? (
          <div className="space-y-3">
            <p className="text-(--text-secondary)">{aiInsight.summary}</p>
            <p className="text-sm">
              <span className="font-semibold">
                {t("coursePage.aiInsight.priority", {
                  defaultValue: "Priority",
                })}
                :
              </span>{" "}
              {aiInsight.priority}
            </p>

            {aiInsight.actions?.length > 0 ? (
              <ul className="space-y-2 text-sm text-(--text-secondary)">
                {aiInsight.actions.map((item, index) => (
                  <li key={`course-ai-action-${index}`} className="flex gap-2">
                    <span className="text-(--color-primary)">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <p className="text-(--text-secondary)">
            {t("coursePage.aiInsight.empty", {
              defaultValue:
                "Generate insight to see personalized course guidance.",
            })}
          </p>
        )}
      </section>

      {loadingModules ? (
        <div className="rounded-2xl border border-(--border-color) bg-(--card-bg) p-6 text-(--text-secondary)">
          {t("coursePage.loadingModules")}
        </div>
      ) : (
        <div className="space-y-5">
          {modules.map((module) => {
            const lessons = module.lessons || [];

            const moduleCompleted = lessons.filter((l) => l.isCompleted).length;

            const moduleProgress =
              lessons.length > 0
                ? Math.round((moduleCompleted / lessons.length) * 100)
                : 0;

            return (
              <div
                key={module._id}
                className="bg-(--card-bg) border border-(--border-color) rounded-2xl shadow-sm"
              >
                <div
                  className="flex justify-between items-center py-5 px-4 md:px-6 cursor-pointer"
                  onClick={() =>
                    setOpenModule(openModule === module._id ? null : module._id)
                  }
                >
                  <div>
                    <h3 className="text-lg font-semibold">
                      {module.title?.[lang]}
                    </h3>
                    <p className="text-sm text-(--text-secondary)">
                      {moduleCompleted}/{lessons.length}{" "}
                      {t("coursePage.lessonsCompleted")} • {moduleProgress}%
                    </p>
                  </div>

                  {openModule === module._id ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  )}
                </div>

                {openModule === module._id && (
                  <div className="px-4 md:px-6 pb-6 space-y-3">
                    {lessons.length === 0 ? (
                      <p className="text-sm text-(--text-secondary)">
                        {t("coursePage.noLessons")}
                      </p>
                    ) : (
                      lessons.map((lesson) => (
                        <div
                          key={lesson._id}
                          className="flex justify-between items-center bg-(--bg-muted) border border-(--border-color) p-4 rounded-xl hover:bg-(--card-bg) transition-all"
                          onClick={() =>
                            navigate(
                              `/student/courses/${slug}/${lesson.slug || lesson._id}`,
                            )
                          }
                        >
                          <div className="cursor-pointer">
                            <h4 className="font-medium">
                              {lesson.title?.[lang] || lesson.title}
                            </h4>
                            <p className="text-xs text-(--text-secondary)">
                              {lesson.difficulty} •{" "}
                              {lesson.estimatedDurationMinutes || 0} min
                            </p>
                          </div>

                          {lesson.isCompleted ? (
                            <FiCheckCircle className="text-(--color-success)" />
                          ) : (
                            <span className="text-xs text-(--text-muted)">
                              {t("coursePage.pending")}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="rounded-xl border border-(--border-color) bg-(--card-bg) p-3">
    <p className="text-xs text-(--text-muted) inline-flex items-center gap-1">
      <span className="text-(--color-primary)">{icon}</span>
      {label}
    </p>
    <p className="font-semibold mt-1">{value}</p>
  </div>
);

const MiniInsight = ({ title, value, subtitle }) => (
  <div className="rounded-xl border border-(--border-color) bg-(--card-bg) p-4">
    <p className="text-xs uppercase tracking-wide text-(--text-muted)">
      {title}
    </p>
    <p className="text-lg font-semibold mt-1">{value}</p>
    <p className="text-xs text-(--text-secondary) mt-1">{subtitle}</p>
  </div>
);

export default CoursePage;
