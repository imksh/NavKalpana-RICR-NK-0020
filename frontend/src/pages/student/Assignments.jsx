import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import api from '../../config/api';

const Assignments = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      const res = await api.get("/student/assignments");
      setAssignments(res.data);
    };
    fetchAssignments();
  }, []);

  const filteredAssignments =
    filter === "all"
      ? assignments
      : assignments.filter((a) =>
          filter === "pending"
            ? a.status === "Pending"
            : filter === "submitted"
              ? a.status === "Submitted"
              : a.status === "Evaluated",
        );

  const getStatusColor = (status) => {
    if (status === "Pending") return "bg-(--color-accent)";
    if (status === "Submitted") return "bg-(--color-warning)";
    if (status === "Evaluated") return "bg-(--color-success)";
    return "bg-(--color-danger)";
  };

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <h1 className="text-3xl font-semibold">Assignments</h1>

        {/* FILTER */}
        <div className="flex gap-2">
          {["all", "pending", "submitted", "evaluated"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 md:px-4 py-2 rounded-xl text-sm ${
                filter === type
                  ? "bg-(--color-primary) text-white"
                  : "bg-(--bg-muted)"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ASSIGNMENT GRID */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredAssignments.map((assignment) => (
          <motion.div
            key={assignment.id}
            whileHover={{ y: -5 }}
            className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-1">{assignment.title}</h3>

            <p className="text-sm text-(--text-secondary) mb-3">
              {assignment.course}
            </p>

            <p className="text-sm mb-4">
              Deadline:{" "}
              <span className="text-(--text-secondary)">
                {new Date(assignment.deadline).toLocaleDateString()}
              </span>
            </p>

            {/* STATUS BADGE */}
            <div className="flex items-center mt-3 gap-2">
              <div
                className={`inline-block px-3 py-1 text-xs text-white rounded-full ${getStatusColor(
                  assignment.status,
                )}`}
              >
                {assignment.status}
              </div>

              {/* MARKS */}
              {assignment.marks !== null && (
                <p className="text-(--color-success) font-medium">
                  Marks: {assignment.marks}/100
                </p>
              )}
            </div>

            {/* OPEN BUTTON */}
            <button
              onClick={() => navigate(`/student/assignments/${assignment._id}`)}
              className="mt-5 w-full py-2 rounded-xl bg-(--color-primary) text-white hover:bg-(--color-primary-hover)"
            >
              Open Assignment
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
