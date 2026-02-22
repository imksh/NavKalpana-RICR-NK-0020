import { useEffect, useMemo, useState } from "react";
import AttendanceHeatmap from "../../components/student/AttendanceHeatmap";
import api from "../../config/api";
import { FaDownload } from "react-icons/fa6";
import AttendanceCalendar from "../../components/AttendanceCalender";
import CourseAttendanceChart from "../../components/CourseAttendanceChart";
import { FiAlertTriangle, FiCheckCircle, FiTrendingUp } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const StudentAttendance = () => {
  const { t } = useTranslation();
  const [attendanceData, setAttendanceData] = useState([]);
  const [courseAttendance, setCourseAttendance] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

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
        {t("studentAttendance.loading")}
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
