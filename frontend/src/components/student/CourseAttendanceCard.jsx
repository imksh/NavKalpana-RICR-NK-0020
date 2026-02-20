const CourseAttendanceCard = ({ course }) => {
  return (
    <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl shadow-sm">
      <h3 className="text-lg font-semibold mb-3">{course.name}</h3>

      <div className="flex justify-between text-sm mb-2">
        <span>Attendance</span>
        <span>{course.percent}%</span>
      </div>

      <div className="w-full h-3 bg-(--bg-muted) rounded-full">
        <div
          className={`h-3 rounded-full ${
            course.percent >= 75 ? "bg-(--color-success)" : "bg-(--color-danger)"
          }`}
          style={{ width: `${course.percent}%` }}
        />
      </div>

      <p className="mt-3 text-sm text-(--text-secondary)">
        Present {course.present} / {course.total} Classes
      </p>
    </div>
  );
};

export default CourseAttendanceCard;
