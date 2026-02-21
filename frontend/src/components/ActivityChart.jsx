import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const ActivityChart = ({ data = [] }) => {
  const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="bg-(--card-bg) py-4 rounded-2xl w-full h-full outline-none">
      <div className="w-full h-40 outline-none">
        <ResponsiveContainer
          width="100%"
          height="100%"
          className="outline-none"
        >
          <AreaChart data={sorted} className="outline-none">
            {/* 🔥 THIS FIXES 1970 ISSUE */}
            <XAxis dataKey="date" hide />

            <Tooltip
              labelFormatter={(label) =>
                new Date(label).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              }
              formatter={(value) => [`${value} Activities`]}
            />

            <defs>
              <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C5CFF" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#7C5CFF" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="count"
              stroke="#7C5CFF"
              strokeWidth={3}
              fill="url(#colorActivity)"
              dot={false}
              className="outline-none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;
