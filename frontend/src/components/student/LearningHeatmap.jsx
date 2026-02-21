import HeatMap from "@uiw/react-heat-map";
import { useEffect, useRef } from "react";
import { useMemo, useState } from "react";
import { FiCalendar } from "react-icons/fi";
import api from "../../config/api";

const LearningHeatmap = () => {
  const [data, setData] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/student/learning-activity");
      setData(res.data.activity);
      setStreak(res.data.streak);
    };
    fetch();
  }, []);

  /* ============================= */
  /*       TRANSFORM DATA          */
  /* ============================= */
  const [tooltip, setTooltip] = useState(null);

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

  const transformedData = useMemo(() => {
    return data.map((item) => ({
      date: item.date.replaceAll("-", "/"),
      count: item.count || 0,
    }));
  }, [data]);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  return (
    <div className="bg-(--card-bg) border border-(--border-color) py-8 px-4 md:p-8 rounded-3xl shadow-sm ">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="sm:text-xl font-semibold">Learning Activity</h3>

        <div className="flex items-center gap-2">
          <FiCalendar className="text-(--color-warning)" />
          <span className="text-(--text-secondary) hidden md:inline-block">Streak:</span>
          <span className="sm:text-xl font-semibold">{streak} Days 🔥</span>
        </div>
      </div>

      {/* HEATMAP */}

      <div className="w-full overflow-auto" ref={scrollRef}>
        <div className="min-w-5xl md:max-w-5xl md:mx-auto ">
          <HeatMap
            value={transformedData}
            startDate={start}
            endDate={end}
            rectSize={15}
            space={4}
            weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
            monthPlacement="top"
            legendCellSize={0}
            panelColors={[
              "var(--bg-muted)",
              "#9be9a8",
              "#40c463",
              "#30a14e",
              "#216e39",
            ]}
            className="w-full"
            style={{
              color: "var(--text-secondary)",
            }}
            rectRender={(props, item) => (
              <rect
                {...props}
                rx={4}
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => {
                  const rect = e.target.getBoundingClientRect();
                  setTooltip({
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                    content: `${item.date} — ${item.count || 0} activities`,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            )}
          />

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
      <div className="flex justify-end items-center gap-2 mt-8 text-sm text-(--text-muted)">
        <span>Less</span>
        <div className="w-4 h-4 rounded-sm bg-(--bg-muted)"></div>
        <div className="w-4 h-4 rounded-sm bg-[#9be9a8]"></div>
        <div className="w-4 h-4 rounded-sm bg-[#40c463]"></div>
        <div className="w-4 h-4 rounded-sm bg-[#30a14e]"></div>
        <div className="w-4 h-4 rounded-sm bg-[#216e39]"></div>
        <span>More</span>
      </div>
    </div>
  );
};

export default LearningHeatmap;
