import HeatMap from "@uiw/react-heat-map";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiCalendar } from "react-icons/fi";

const AttendanceHeatmap = ({ data = [] }) => {
  const [tooltip, setTooltip] = useState(null);

  /* ================= DATE RANGE ================= */
  const start = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 11);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const end = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  /* ================= TRANSFORM ================= */
  const transformedData = useMemo(() => {
    const map = new Map();

    // Map existing attendance
    data.forEach((item) => {
      map.set(item.date, item.status);
    });

    const allDates = [];
    const current = new Date(start);

    while (current <= end) {
      const yyyy = current.getFullYear();
      const mm = String(current.getMonth() + 1).padStart(2, "0");
      const dd = String(current.getDate()).padStart(2, "0");
      const formatted = `${yyyy}-${mm}-${dd}`;

      const status = map.get(formatted);

      allDates.push({
        date: formatted.replaceAll("-", "/"),
        count: status === "Present" ? 2 : status === "Absent" ? 1 : 0,
        status: status || "NoClass",
      });

      current.setDate(current.getDate() + 1);
    }

    return allDates;
  }, [data, start, end]);

  /* ================= ATTENDANCE % ================= */
  const attendancePercent = useMemo(() => {
    if (!data.length) return 0;
    const presentDays = data.filter((d) => d.status === "Present").length;
    return Math.round((presentDays / data.length) * 100);
  }, [data]);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  return (
    <div className="bg-(--card-bg) border border-(--border-color) py-8 px-4 md:p-8 rounded-3xl shadow-sm overflow-x-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="sm:text-xl font-semibold">Attendance Overview</h3>

        <div className="flex items-center gap-2">
          <FiCalendar className="text-(--color-success)" />
          <span className="text-(--text-secondary) hidden sm:block">
            Attendance:
          </span>
          <span className="text-xl font-semibold">{attendancePercent}%</span>
        </div>
      </div>

      {/* HEATMAP */}
      <div className="w-full overflow-auto" ref={scrollRef}>
        <div className="min-w-6xl md:max-w-6xl md:mx-auto ">
          <HeatMap
            value={transformedData}
            startDate={start}
            endDate={end}
            rectSize={15}
            space={4}
            weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
            monthPlacement="top"
            legendCellSize={0}
            className="w-full"
            style={{ color: "var(--text-secondary)" }}
            rectRender={(props, item) => {
              let fillColor = "var(--bg-muted)"; // default → No Class

              if (item.count === 1) fillColor = "#f87171"; // Absent
              if (item.count === 2) fillColor = "#22c55e"; // Present

              return (
                <rect
                  {...props}
                  rx={4}
                  fill={fillColor} // 🔥 FORCE COLOR
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    const rect = e.target.getBoundingClientRect();
                    setTooltip({
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                      content:
                        item.count === 2
                          ? `${item.date} — Present`
                          : item.count === 1
                            ? `${item.date} — Absent`
                            : `${item.date} — No Class`,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            }}
          />

          {/* TOOLTIP */}
          {tooltip && (
            <div
              className="fixed z-[9999] px-3 py-2 rounded-lg text-sm bg-(--bg-surface) border border-(--border-color) shadow-lg pointer-events-none"
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: "translate(-50%, -120%)",
              }}
            >
              {tooltip.content}
            </div>
          )}
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex justify-end items-center gap-3 mt-8 text-sm text-(--text-muted)">
        <span>No Class</span>
        <div className="w-4 h-4 rounded-sm bg-(--bg-muted)"></div>

        <span>Absent</span>
        <div className="w-4 h-4 rounded-sm bg-[#f87171]"></div>

        <span>Present</span>
        <div className="w-4 h-4 rounded-sm bg-[#22c55e]"></div>
      </div>
    </div>
  );
};

export default AttendanceHeatmap;
