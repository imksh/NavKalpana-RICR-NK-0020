import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";

const AttendanceCalendar = ({ attendance = [] }) => {
  const [value, setValue] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const containerRef = useRef(null);

  console.log("Attendance data:", attendance);

  const isAttendanceDate = (date) => {
    return attendance.some(
      (record) => new Date(record.date).toDateString() === date.toDateString(),
    );
  };

  const selectedAttendance = attendance.filter(
    (record) => new Date(record.date).toDateString() === value.toDateString(),
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ x:[-10,0,10,0] }}
      transition={{duration:0.2}}
      ref={containerRef}
      className="relative bg-(--card-bg) border border-(--border-color)  rounded-2xl"
    >
      <Calendar
        onChange={(date) => {
          setValue(date);
          setShowPopup(true);
        }}
        value={value}
        tileContent={({ date }) => {
          const record = attendance.find(
            (a) => new Date(a.date).toDateString() === date.toDateString(),
          );

          if (!record) return null;

          return (
            <div className="flex justify-center mt-1 !rounded-2xl">
              <div
                className={`hidden md:block w-2 h-2 rounded-full ${
                  record.status === "Present"
                    ? "bg-(--color-success)"
                    : "bg-(--color-danger)"
                }`}
              ></div>
            </div>
          );
        }}
        tileClassName={({ date }) => {
          const record = attendance.find(
            (a) => new Date(a.date).toDateString() === date.toDateString(),
          );

          if (!record) return "hover:!bg-(--color-secondary) rounded-2xl";

          return `font-semibold rounded-2xl hover:!bg-(--color-secondary) ${
            record.status === "Present"
              ? "text-(--color-success)"
              : "text-(--color-danger)"
          }`;
        }}
        className="!bg-(--bg-main) !border-none !w-full !rounded-2xl p-2 sm:p-4"
      />

      {showPopup && selectedAttendance.length > 0 && (
        <div className="absolute top-24 right-6 w-72 bg-(--card-bg) border border-(--border-color) rounded-xl shadow-xl p-4 z-50">
          <h4 className="font-semibold mb-3 text-sm">{value.toDateString()}</h4>

          {selectedAttendance.map((record) => (
            <div key={record._id} className="mb-3 last:mb-0">
              <p
                className={`text-[10px] w-fit px-2 py-0.5 rounded-2xl float-end ${
                  record.status === "Present"
                    ? "bg-(--color-success)/20 text-(--color-success)"
                    : "bg-(--color-danger)/20 text-(--color-danger)"
                }`}
              >
                {record.status}
              </p>

              <p className="text-sm font-medium">Attendance Record</p>

              <p className="text-xs text-(--text-secondary)">
                Status: {record.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AttendanceCalendar;
