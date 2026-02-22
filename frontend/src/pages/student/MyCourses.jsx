import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import api from "../../config/api";
import useUiStore from "../../store/useUiStore";
import { useTranslation } from "react-i18next";

const MyCourses = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useUiStore();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [coursesRes, statsRes] = await Promise.allSettled([
          api.get("/student/courses"),
          api.get("/student/stats"),
        ]);

        if (coursesRes.status === "fulfilled") {
          setCourses(coursesRes.value.data || []);
        }

        if (statsRes.status === "fulfilled") {
          setStats(statsRes.value.data || null);
        }
      } catch (error) {
        console.log("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  const averageProgress = courses.length
    ? Math.round(
        courses.reduce((sum, course) => sum + (course.progress || 0), 0) /
          courses.length,
      )
    : 0;

  const highProgressCourses = courses.filter(
    (course) => (course.progress || 0) >= 75,
  ).length;

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        {t("myCourses.loading")}
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-4 md:px-10 lg:px-16 pt-10 md:pt-14 pb-16 space-y-8 md:space-y-10">
      <section className="rounded-3xl border border-(--border-color) bg-(--bg-surface) p-6 md:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-(--border-color) bg-(--bg-muted) px-3 py-1 text-xs md:text-sm text-(--text-secondary)">
              <FiBookOpen size={14} /> {t("myCourses.badge")}
            </span>
            <h1 className="text-3xl md:text-4xl font-semibold mt-4">
              {t("myCourses.title")}
            </h1>
            <p className="text-(--text-secondary) mt-2">
              {t("myCourses.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full lg:w-auto">
            <TopStat
              label={t("myCourses.top.enrolled")}
              value={courses.length}
              icon={<FiBookOpen />}
            />
            <TopStat
              label={t("myCourses.top.avgProgress")}
              value={`${averageProgress}%`}
              icon={<FiTrendingUp />}
            />
            <TopStat
              label={t("myCourses.top.onTrack")}
              value={highProgressCourses}
              icon={<FiCheckCircle />}
            />
            <TopStat
              label={t("myCourses.top.overallScore")}
              value={
                stats?.overallScore != null ? `${stats.overallScore}%` : "--"
              }
              icon={<FiClock />}
            />
          </div>
        </div>
      </section>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-(--border-color) bg-(--card-bg) p-8 text-center text-(--text-secondary)">
          {t("myCourses.empty")}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-7">
          {courses.map((course) => {
            const title =
              course?.title?.[lang] ||
              course?.title?.en ||
              t("myCourses.untitled");
            const thumbnail =
              course?.thumbnail?.url ||
              course?.thumbnail ||
              "/default-course.png";
            const instructorName =
              course?.instructor?.name || t("myCourses.instructor");
            const progress = course?.progress || 0;
            const attendance = course?.attendancePercent || 0;
            const skills = course?.skills || [];

            return (
              <div
                key={course._id || course.id}
                className="bg-(--card-bg) border border-(--border-color) rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-all"
              >
                <img
                  src={thumbnail}
                  alt={title}
                  className="w-full h-48 object-cover"
                />

                <div className="p-5 md:p-6">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                    {title}
                  </h3>

                  <div className="flex items-center gap-2 text-(--text-secondary) text-sm mb-4">
                    <FiUser size={14} />
                    {instructorName}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <MiniMetric
                      label={t("myCourses.progress")}
                      value={`${progress}%`}
                      tone="primary"
                    />
                    <MiniMetric
                      label={t("myCourses.attendance")}
                      value={`${attendance}%`}
                      tone={attendance >= 75 ? "success" : "warning"}
                    />
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-(--text-secondary)">
                        {t("myCourses.completion")}
                      </span>
                      <span>{progress}%</span>
                    </div>

                    <div className="w-full h-2 bg-(--bg-muted) rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-(--color-primary) rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6 min-h-9">
                    {skills.slice(0, 4).map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 bg-(--bg-muted) rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {skills.length > 4 ? (
                      <span className="text-xs px-3 py-1 bg-(--bg-muted) rounded-full">
                        {t("myCourses.more", { count: skills.length - 4 })}
                      </span>
                    ) : null}
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/student/courses/${course.slug}`, {
                        state: course,
                      })
                    }
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-(--color-primary) cursor-pointer text-white hover:bg-(--color-primary-hover) transition-all"
                  >
                    {t("myCourses.continue")} <FiArrowRight />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const TopStat = ({ label, value, icon }) => (
  <div className="rounded-xl border border-(--border-color) bg-(--card-bg) px-3 py-3 min-w-30">
    <div className="flex items-center justify-between mb-1 text-(--text-secondary)">
      <span className="text-xs">{label}</span>
      <span className="text-(--color-primary)">{icon}</span>
    </div>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

const MiniMetric = ({ label, value, tone }) => (
  <div className="rounded-xl border border-(--border-color) px-3 py-2">
    <p className="text-xs text-(--text-muted)">{label}</p>
    <p
      className={`font-semibold ${
        tone === "success"
          ? "text-(--color-success)"
          : tone === "warning"
            ? "text-(--color-warning)"
            : "text-(--color-primary)"
      }`}
    >
      {value}
    </p>
  </div>
);

export default MyCourses;
