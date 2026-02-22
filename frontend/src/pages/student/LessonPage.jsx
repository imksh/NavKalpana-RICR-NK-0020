import { useState, useEffect } from "react";
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiPlayCircle,
  FiTarget,
  FiUser,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/api";
import useUiStore from "../../store/useUiStore";
import { IoCopyOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import LottieIcon from "../../components/LottieIcon";
import Back from "../../assets/animations/Logout.json";
import { useTranslation } from "react-i18next";

const LessonPage = () => {
  const { t } = useTranslation();
  const { course, slug } = useParams();
  const navigate = useNavigate();
  const { lang } = useUiStore();

  const [lesson, setLesson] = useState(null);
  const [courseMeta, setCourseMeta] = useState(null);
  const [moduleLessons, setModuleLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH LESSON ================= */
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await api.get(`/course/lesson/${slug}`);
        setLesson(res.data);

        const [moduleRes, courseRes] = await Promise.allSettled([
          api.get(`/course/module/${res.data.moduleId}/lessons`),
          api.get(`/course/${course}`),
        ]);

        if (moduleRes.status === "fulfilled") {
          setModuleLessons(moduleRes.value.data || []);
        }

        if (courseRes.status === "fulfilled") {
          setCourseMeta(courseRes.value.data || null);
        }
      } catch (error) {
        console.log("Error fetching lesson:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [slug, course]);

  const markCompleted = async (lessonId) => {
    try {
      await api.put(`/course/lesson/${lessonId}/completed`, {
        lessonId,
        courseId: lesson.courseId,
        completed: true,
      });

      setLesson((prev) => ({ ...prev, isCompleted: true }));
      setModuleLessons((prev) =>
        prev.map((l) => (l._id === lessonId ? { ...l, isCompleted: true } : l)),
      );
    } catch (error) {
      console.log("Error marking lesson complete:", error);
    }
  };

  const progressPercent =
    moduleLessons.length > 0
      ? Math.round(
          (moduleLessons.filter((l) => l.isCompleted).length /
            moduleLessons.length) *
            100,
        )
      : 0;

  const completedLessons = moduleLessons.filter((l) => l.isCompleted).length;

  const currentLessonIndex = moduleLessons.findIndex((l) => l.slug === slug);
  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < moduleLessons.length - 1
      ? moduleLessons[currentLessonIndex + 1]
      : null;

  useEffect(() => {
    if (!lesson) return;
    const addStreak = async () => {
      const res = await api.post(`/student/lesson/${lesson._id}/opened`, {
        lessonId: lesson._id,
        courseId: lesson.courseId,
      });
      console.log("Lesson Opened Activity Logged:", res.data);
    };
    addStreak();
  }, [lesson]);

  if (loading) {
    return <Loading />;
  }

  if (!lesson) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        {t("lessonPage.notFound")}
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-4 md:px-10 lg:px-16 pt-10 md:pt-14 pb-16 space-y-8">
      <section className="rounded-3xl border border-(--border-color) bg-(--bg-surface) p-5 md:p-8 shadow-sm">
        <button
          onClick={() => navigate(`/student/courses/${course}`)}
          className="text-(--color-primary) mb-4 inline-flex items-center cursor-pointer"
        >
          <LottieIcon animation={Back} className="w-16 rotate-y-180" />{" "}
          {t("lessonPage.backToModule")}
        </button>

        <div className="grid lg:grid-cols-3 gap-5 md:gap-6">
          <div className="lg:col-span-2">
            <h1 className="text-2xl md:text-4xl font-semibold leading-tight">
              {lesson.title?.[lang]}
            </h1>

            <p className="mt-2 text-(--text-secondary) text-sm md:text-base">
              {lesson.difficulty} • {lesson.estimatedDurationMinutes || 0} min
            </p>

            <div className="mt-5">
              <div className="flex justify-between text-sm mb-1">
                <span>{t("lessonPage.moduleProgress")}</span>
                <span>{progressPercent}%</span>
              </div>

              <div className="w-full h-3 bg-(--bg-muted) rounded-full overflow-hidden">
                <div
                  className="h-3 bg-(--color-primary) rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-3">
            <StatPill
              icon={<FiBookOpen size={14} />}
              label={t("lessonPage.moduleLessons")}
              value={moduleLessons.length}
            />
            <StatPill
              icon={<FiCheckCircle size={14} />}
              label={t("lessonPage.completed")}
              value={completedLessons}
            />
            <StatPill
              icon={<FiUser size={14} />}
              label={t("lessonPage.instructor")}
              value={courseMeta?.instructor?.name || t("common.na")}
            />
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-2 space-y-6">
          {lesson.videoUrl && (
            <div className="rounded-2xl overflow-hidden border border-(--border-color) shadow-sm bg-black">
              <iframe
                src={lesson.videoUrl.replace("watch?v=", "embed/")}
                title="Lesson Video"
                className="w-full h-72 md:h-96"
                allowFullScreen
              />
            </div>
          )}

          <div className="bg-(--card-bg) border border-(--border-color) p-5 md:p-6 rounded-2xl space-y-6">
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoMini
                icon={<FiClock size={14} />}
                label="Estimated Duration"
                value={`${lesson.estimatedDurationMinutes || 0} min`}
              />
              <InfoMini
                icon={<FiTarget size={14} />}
                label="Difficulty"
                value={lesson.difficulty || "N/A"}
              />
            </div>

            {lesson.objectives?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">
                  {t("lessonPage.objectives")}
                </h3>
                <ul className="space-y-2">
                  {lesson.objectives.map((obj, i) => (
                    <li
                      key={i}
                      className="text-(--text-secondary) flex items-start gap-2"
                    >
                      <FiCheckCircle className="text-(--color-success) mt-0.5" />
                      {obj?.[lang]}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lesson.content?.[lang] && (
              <div>
                <h3 className="font-semibold mb-2">
                  {t("lessonPage.content")}
                </h3>
                <p className="text-(--text-secondary) whitespace-pre-line">
                  {lesson.content[lang]}
                </p>
              </div>
            )}

            {lesson.keyConcepts?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">
                  {t("lessonPage.keyConcepts")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {lesson.keyConcepts.map((concept, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs bg-(--bg-muted) rounded-full"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {lesson.codeExample && (
              <div>
                <h3 className="font-semibold mb-2">{t("lessonPage.code")}</h3>
                <pre className="bg-black text-green-400 p-4 rounded-xl overflow-x-auto text-sm">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(lesson.codeExample);
                      toast.success(t("lessonPage.codeCopied"));
                    }}
                    className="float-right text-white hover:text-(--color-primary) transition cursor-pointer"
                    title="Copy"
                  >
                    <IoCopyOutline className="text-lg" />
                  </button>
                  <code>{lesson.codeExample}</code>
                </pre>
              </div>
            )}

            <button
              onClick={() => markCompleted(lesson._id)}
              className={`mt-2 px-6 py-3 rounded-xl cursor-pointer hover:bg-(--color-primary-hover) ${
                lesson.isCompleted
                  ? "bg-(--color-success) text-white"
                  : "bg-(--color-primary) text-white"
              }`}
              disabled={lesson.isCompleted}
            >
              {lesson.isCompleted
                ? t("lessonPage.completedBtn")
                : t("lessonPage.markComplete")}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4">
            <h3 className="font-semibold mb-2">
              {t("lessonPage.moduleLessons")}
            </h3>
            <p className="text-sm text-(--text-secondary)">
              {t("lessonPage.moduleLessonsSub")}
            </p>
          </div>

          {nextLesson ? (
            <button
              onClick={() =>
                navigate(`/student/courses/${course}/${nextLesson.slug}`)
              }
              className="w-full rounded-2xl border border-(--border-color) bg-(--card-bg) p-4 text-left hover:bg-(--bg-muted) transition-all cursor-pointer"
            >
              <p className="text-xs text-(--text-secondary) mb-1">
                {t("lessonPage.upNext")}
              </p>
              <p className="font-medium line-clamp-2">
                {nextLesson.title?.[lang]}
              </p>
              <p className="text-xs text-(--text-secondary) mt-1 inline-flex items-center gap-1">
                <FiPlayCircle size={12} />{" "}
                {nextLesson.estimatedDurationMinutes || 0} min
              </p>
            </button>
          ) : null}

          {moduleLessons.map((l) => (
            <div
              key={l._id}
              onClick={() => navigate(`/student/courses/${course}/${l.slug}`)}
              className={`p-4 rounded-xl cursor-pointer border ${
                l.slug === slug
                  ? "border-(--color-primary) bg-(--bg-muted)"
                  : "border-(--border-color) bg-(--card-bg)"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{l.title?.[lang]}</h4>
                  <p className="text-xs text-(--text-secondary)">
                    {l.estimatedDurationMinutes} min
                  </p>
                </div>

                {l.isCompleted && (
                  <FiCheckCircle className="text-(--color-success)" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatPill = ({ icon, label, value }) => (
  <div className="rounded-xl border border-(--border-color) bg-(--card-bg) p-3">
    <p className="text-xs text-(--text-muted) inline-flex items-center gap-1">
      <span className="text-(--color-primary)">{icon}</span>
      {label}
    </p>
    <p className="font-semibold mt-1 text-sm md:text-base line-clamp-1">
      {value}
    </p>
  </div>
);

const InfoMini = ({ icon, label, value }) => (
  <div className="rounded-xl border border-(--border-color) bg-(--bg-surface) p-3">
    <p className="text-xs text-(--text-muted) inline-flex items-center gap-1">
      {icon} {label}
    </p>
    <p className="font-medium mt-1">{value}</p>
  </div>
);

export default LessonPage;
