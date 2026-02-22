import React from "react";
import useWindowSize from "../hooks/useWindowSize";
import { motion } from "motion/react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const AttendanceStatusChart = ({ attendance = [] }) => {
  const presentCount = attendance.filter((a) => a.status === "Present").length;

  const absentCount = attendance.filter((a) => a.status === "Absent").length;

  const data = [
    { name: "Present", value: presentCount },
    { name: "Absent", value: absentCount },
  ];

  const size = useWindowSize();

  const COLORS = ["#22c55e", "#ef4444"]; // success & danger

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className="w-full h-48 md:h-[350px]"
    >
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={size.width > 640 ? 120 : 60}
            label={({ name, percent }) =>
              `${size.width > 640 ? name : ""} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default AttendanceStatusChart;
