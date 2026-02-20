import HeatMap from "@uiw/react-heat-map";
import { useMemo, useState } from "react";

const AttendanceHeatmap = ({ data = [] }) => {
  const [tooltip, setTooltip] = useState(null);

  const transformedData = useMemo(() => {
    return data.map((item) => ({
      date: item.date.replaceAll("-", "/"),
      count: item.status === "Present" ? 1 : 0,
      status: item.status,
    }));
  }, [data]);

  return (
    <div className="relative bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl shadow-sm overflow-x-auto">
      <h3 className="text-lg font-semibold mb-6">Attendance Overview</h3>

      <HeatMap
        value={transformedData}
        startDate={
          new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        }
        rectSize={12}
        space={4}
        monthPlacement="top"
        legendCellSize={0}
        panelColors={["var(--bg-muted)", "var(--color-success)"]}
        className="w-full"
        style={{
          color: "var(--text-secondary)",
        }}
        rectRender={(props, item) => (
          <rect
            {...props}
            rx={3}
            style={{ cursor: "pointer" }}
            onMouseEnter={(e) => {
              const rect = e.target.getBoundingClientRect();
              setTooltip({
                x: rect.left + rect.width / 2,
                y: rect.top - 10,
                content:
                  item.count === 1
                    ? `${item.date} — Present`
                    : `${item.date} — No Class`,
              });
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        )}
      />

      {/* 🔥 Custom Tooltip */}
      {tooltip && (
        <div
          className="fixed z-[9999] px-3 py-1 rounded-md text-sm bg-(--bg-surface) border border-(--border-color) shadow-md"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default AttendanceHeatmap;
