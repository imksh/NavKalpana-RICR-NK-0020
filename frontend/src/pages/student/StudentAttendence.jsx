import { useMemo } from "react";
import CourseAttendanceCard from "../../components/student/CourseAttendanceCard";
import AttendanceHeatmap from "../../components/student/AttendanceHeatmap";

const StudentAttendance = () => {

  const attendanceData = [
    { date: "2026-02-01", status: "Present" },
    { date: "2026-02-02", status: "Absent" },
    { date: "2026-02-03", status: "Present" },
    { date: "2026-02-04", status: "Present" }
  ];

  const courseAttendance = [
    { name: "Full Stack Development", present: 18, total: 22 },
    { name: "Data Structures", present: 12, total: 20 },
    { name: "Operating Systems", present: 16, total: 18 }
  ];

  const totalClasses = attendanceData.length;
  const presentDays = attendanceData.filter(
    (a) => a.status === "Present"
  ).length;

  const attendancePercent = Math.round(
    (presentDays / totalClasses) * 100
  );

  // 🔥 Streak calculation
  const streak = useMemo(() => {
    let count = 0;

    for (let i = attendanceData.length - 1; i >= 0; i--) {
      if (attendanceData[i].status === "Present") {
        count++;
      } else {
        break;
      }
    }

    return count;
  }, [attendanceData]);

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16 space-y-10">

      {/* TITLE */}
      <h1 className="text-3xl font-semibold">
        Attendance
      </h1>

      {/* OVERALL + STREAK GRID */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* OVERALL CARD */}
        <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl">

          <h2 className="text-lg font-medium mb-4">
            Overall Attendance
          </h2>

          <div className="flex justify-between mb-2 text-sm">
            <span>Attendance Percentage</span>
            <span>{attendancePercent}%</span>
          </div>

          <div className="w-full h-3 bg-(--bg-muted) rounded-full">
            <div
              className={`h-3 rounded-full ${
                attendancePercent >= 75
                  ? "bg-(--color-success)"
                  : "bg-(--color-danger)"
              }`}
              style={{ width: `${attendancePercent}%` }}
            />
          </div>

          <p className="mt-3 text-(--text-secondary) text-sm">
            Present: {presentDays} / {totalClasses} Classes
          </p>

        </div>

        {/* STREAK CARD */}
        <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl flex flex-col justify-center">

          <h2 className="text-lg font-medium mb-3">
            Attendance Streak
          </h2>

          <p className="text-4xl font-bold text-(--color-primary)">
            🔥 {streak} Days
          </p>

          <p className="text-(--text-secondary) text-sm mt-2">
            Keep maintaining consistency!
          </p>

        </div>
      </div>

      {/* LOW WARNING */}
      {attendancePercent < 75 && (
        <div className="p-4 rounded-xl bg-(--color-danger) text-white">
          ⚠ Your attendance is below 75%. You may not be eligible for exams.
        </div>
      )}

      {/* HEATMAP */}
      <AttendanceHeatmap data={attendanceData} />

      {/* COURSE-WISE ATTENDANCE */}
      <div>
        <h2 className="text-xl font-semibold mb-6">
          Course-wise Attendance
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courseAttendance.map((course, index) => (
            <CourseAttendanceCard
              key={index}
              course={course}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default StudentAttendance;