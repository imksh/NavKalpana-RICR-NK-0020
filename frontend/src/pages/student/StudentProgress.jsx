import {
  FiTrendingUp,
  FiAward,
  FiBookOpen,
  FiActivity,
  FiTarget,
  FiBarChart2,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../../config/api";
import { useTranslation } from "react-i18next";

const StudentProgress = () => {
  const { t } = useTranslation();
  const [progressData, setProgressData] = useState(null);
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [progressRes, statsRes] = await Promise.allSettled([
          api.get("/student/progress"),
          api.get("/student/stats"),
        ]);

        if (progressRes.status === "fulfilled") {
          setProgressData(progressRes.value.data);
        }

        if (statsRes.status === "fulfilled") {
          setStatsData(statsRes.value.data);
        }
      } catch (error) {
        console.log("Error fetching progress:", error);
      }
    };
    fetch();
  }, []);

  if (!progressData) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        {t("studentProgress.loading")}
      </div>
    );
  }

  const {
    overallProgress,
    courseProgress,
    avgQuizScore,
    avgAssignmentScore,
    skills,
    insight,
  } = progressData;

  const attendancePercent = statsData?.attendancePercent ?? null;
  const courseCompletionPercent = statsData?.courseCompletionPercent ?? null;
  const overallScore = statsData?.overallScore ?? null;
  const totalSkills = statsData?.totalSkills ?? null;

  const skillCoverage = totalSkills
    ? Math.round(((skills?.length || 0) / totalSkills) * 100)
    : null;

  const performanceBlend = Math.round(
    (overallProgress + avgQuizScore + avgAssignmentScore) / 3,
  );

  const focusCourses = [...courseProgress]
    .sort((a, b) => a.progress - b.progress)
    .slice(0, 2);

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-4 md:px-10 lg:px-16 pt-10 md:pt-14 pb-16 space-y-8 md:space-y-10">
      <section className="rounded-3xl border border-(--border-color) bg-(--bg-surface) p-6 md:p-8 shadow-sm">
        <span className="inline-flex items-center gap-2 rounded-full border border-(--border-color) bg-(--bg-muted) px-3 py-1 text-xs md:text-sm text-(--text-secondary)">
          <FiBarChart2 size={14} /> {t("studentProgress.badge")}
        </span>
        <h1 className="text-3xl md:text-4xl font-semibold mt-4 mb-2">
          {t("studentProgress.title")}
        </h1>
        <p className="text-(--text-secondary)">
          {t("studentProgress.subtitle")}
        </p>
      </section>

      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        <MetricCard
          icon={<FiTrendingUp />}
          title={t("studentProgress.cards.overall")}
          value={`${overallProgress}%`}
          tone="primary"
        />
        <MetricCard
          icon={<FiActivity />}
          title={t("studentProgress.cards.quiz")}
          value={`${avgQuizScore}%`}
          tone="success"
        />
        <MetricCard
          icon={<FiAward />}
          title={t("studentProgress.cards.assignment")}
          value={`${avgAssignmentScore}%`}
          tone="accent"
        />
        <MetricCard
          icon={<FiTarget />}
          title={t("studentProgress.cards.score")}
          value={
            overallScore !== null ? `${overallScore}%` : `${performanceBlend}%`
          }
          tone="warning"
          subtitle={
            overallScore !== null
              ? t("studentProgress.cards.scoreSub1")
              : t("studentProgress.cards.scoreSub2")
          }
        />
      </section>

      <section className="bg-(--card-bg) border border-(--border-color) p-6 md:p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <FiTrendingUp /> {t("studentProgress.cards.overall")}
          </h2>
          <span className="text-xl font-semibold">{overallProgress}%</span>
        </div>
        <ProgressBar
          value={overallProgress}
          colorClass="bg-(--color-primary)"
        />

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <InlineStat
            label={t("studentProgress.attendance")}
            value={
              attendancePercent !== null
                ? `${attendancePercent}%`
                : t("studentProgress.notAvailable")
            }
          />
          <InlineStat
            label={t("studentProgress.courseCompletion")}
            value={
              courseCompletionPercent !== null
                ? `${courseCompletionPercent}%`
                : t("studentProgress.notAvailable")
            }
          />
          <InlineStat
            label={t("studentProgress.skillCoverage")}
            value={
              skillCoverage !== null
                ? `${skillCoverage}%`
                : t("studentProgress.notAvailable")
            }
          />
        </div>
      </section>

      <section className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-(--card-bg) border border-(--border-color) p-6 md:p-8 rounded-3xl">
          <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
            <FiBookOpen /> {t("studentProgress.coursePerformance")}
          </h2>

          <div className="space-y-5">
            {courseProgress.map((course) => (
              <div
                key={course._id}
                className="rounded-xl border border-(--border-color) p-4"
              >
                <div className="flex justify-between mb-2 text-sm md:text-base">
                  <span className="font-medium">{course.name}</span>
                  <span>{course.progress}%</span>
                </div>
                <ProgressBar
                  value={course.progress}
                  colorClass="bg-(--color-accent)"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-3xl">
            <h3 className="text-lg font-medium mb-4">
              {t("studentProgress.focus")}
            </h3>
            {focusCourses.length > 0 ? (
              <div className="space-y-3">
                {focusCourses.map((course) => (
                  <div
                    key={course._id}
                    className="flex items-start gap-2 text-(--text-secondary)"
                  >
                    <FiAlertCircle className="mt-0.5 text-(--color-warning)" />
                    <p>
                      {course.name}: {t("studentProgress.currentlyAt")}{" "}
                      <span className="font-semibold text-(--text-primary)">
                        {course.progress}%
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-(--text-secondary)">
                {t("studentProgress.noCourseData")}
              </p>
            )}
          </div>

          <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-3xl">
            <h3 className="text-lg font-medium mb-4">
              {t("studentProgress.aiInsight")}
            </h3>
            <p className="text-(--text-secondary)">{insight}</p>
          </div>
        </div>
      </section>

      <section className="bg-(--card-bg) border border-(--border-color) p-6 md:p-8 rounded-3xl">
        <h2 className="text-lg font-medium mb-5">
          {t("studentProgress.skills")}
        </h2>

        {skills.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-(--bg-muted) rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-5 text-sm text-(--text-secondary) flex items-center gap-2">
              <FiCheckCircle className="text-(--color-success)" />
              {t("studentProgress.skillsRecorded", { count: skills.length })}
              {totalSkills
                ? t("studentProgress.skillsOutOf", { total: totalSkills })
                : ""}
              .
            </div>
          </>
        ) : (
          <p className="text-(--text-secondary)">
            {t("studentProgress.noSkills")}
          </p>
        )}
      </section>
    </div>
  );
};

const ProgressBar = ({ value, colorClass }) => (
  <div className="w-full h-3 bg-(--bg-muted) rounded-full overflow-hidden">
    <div
      className={`h-3 rounded-full ${colorClass}`}
      style={{ width: `${Math.max(0, Math.min(100, value || 0))}%` }}
    />
  </div>
);

const MetricCard = ({ icon, title, value, tone, subtitle }) => (
  <div className="bg-(--card-bg) border border-(--border-color) p-5 rounded-2xl shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <span className="text-(--text-secondary) text-sm">{title}</span>
      <span
        className={
          tone === "success"
            ? "text-(--color-success)"
            : tone === "accent"
              ? "text-(--color-accent)"
              : tone === "warning"
                ? "text-(--color-warning)"
                : "text-(--color-primary)"
        }
      >
        {icon}
      </span>
    </div>
    <p className="text-3xl font-semibold">{value}</p>
    {subtitle ? (
      <p className="text-xs text-(--text-muted) mt-2">{subtitle}</p>
    ) : null}
  </div>
);

const InlineStat = ({ label, value }) => (
  <div className="rounded-xl border border-(--border-color) p-4 bg-(--bg-surface)">
    <p className="text-xs uppercase tracking-wide text-(--text-muted)">
      {label}
    </p>
    <p className="text-base font-semibold mt-1">{value}</p>
  </div>
);

export default StudentProgress;
