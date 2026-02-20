import { useEffect, useMemo, useState } from "react";
import CourseAttendanceCard from "../../components/student/CourseAttendanceCard";
import AttendanceHeatmap from "../../components/student/AttendanceHeatmap";
import api from "../../config/api";

const StudentAttendance = () => {
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

  /* ===== Derived Stats ===== */

  const totalClasses = attendanceData?.length || 0;

  const presentDays = useMemo(() => {
    return attendanceData.filter(
      (a) => a.status === "Present"
    ).length;
  }, [attendanceData]);

  const attendancePercent = totalClasses
    ? Math.round((presentDays / totalClasses) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        Loading attendance...
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-20">

      {/* ===== HEADER ===== */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold mb-2">
          Attendance Overview
        </h1>
        <p className="text-(--text-secondary)">
          Track your class consistency and eligibility.
        </p>
      </div>

      {/* ===== TOP SUMMARY GRID ===== */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        {/* Overall */}
        <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-3xl">
          <h3 className="text-sm text-(--text-secondary) mb-2">
            Overall Attendance
          </h3>
          <p className="text-3xl font-bold">
            {attendancePercent}%
          </p>

          <div className="w-full h-2 bg-(--bg-muted) rounded-full mt-4">
            <div
              className={`h-2 rounded-full ${
                attendancePercent >= 75
                  ? "bg-(--color-success)"
                  : "bg-(--color-danger)"
              }`}
              style={{ width: `${attendancePercent}%` }}
            />
          </div>
        </div>

        {/* Present Days */}
        <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-3xl">
          <h3 className="text-sm text-(--text-secondary) mb-2">
            Present Days
          </h3>
          <p className="text-3xl font-bold">
            {presentDays}
          </p>
          <p className="text-(--text-secondary) text-sm mt-2">
            out of {totalClasses} classes
          </p>
        </div>

        {/* Streak */}
        <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-3xl">
          <h3 className="text-sm text-(--text-secondary) mb-2">
            Current Streak
          </h3>
          <p className="text-3xl font-bold text-(--color-primary)">
            🔥 {streak} Days
          </p>
        </div>

      </div>

      {/* Warning */}
      {attendancePercent > 0 && attendancePercent < 75 && (
        <div className="mb-10 p-4 rounded-xl bg-(--color-danger) text-white">
          ⚠ Attendance below 75%. Improve consistency.
        </div>
      )}

      {/* ===== HEATMAP ===== */}
      <div className="mb-14">
        <AttendanceHeatmap data={attendanceData} />
      </div>

      {/* ===== COURSE-WISE ===== */}
      <div>
        <h2 className="text-xl font-semibold mb-6">
          Course-wise Attendance
        </h2>

        {courseAttendance.length === 0 ? (
          <p className="text-(--text-secondary)">
            No course attendance data available.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courseAttendance.map((course) => (
              <CourseAttendanceCard
                key={course._id}
                course={course}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentAttendance;