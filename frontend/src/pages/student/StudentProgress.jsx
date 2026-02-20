import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiAward,
  FiBookOpen,
  FiActivity,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../../config/api";

const StudentProgress = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/student/progress");
      setData(res.data);
    };
    fetch();
  }, []);

  if (!data) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        Loading progress...
      </div>
    );
  }

  const {
    overallProgress,
    courseProgress,
    avgQuizScore,
    avgAssignmentScore,
    skills,
    insight,
  } = data;

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">

      {/* TITLE */}
      <div className="mb-12">
        <h1 className="text-3xl font-semibold mb-3">
          Progress Analytics
        </h1>
        <p className="text-(--text-secondary)">
          Track your learning journey and performance insights.
        </p>
      </div>

      {/* OVERALL */}
      <div className="bg-(--card-bg) border border-(--border-color) p-8 rounded-3xl mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <FiTrendingUp />
            Overall Completion
          </h2>
          <span className="text-xl font-semibold">
            {overallProgress}%
          </span>
        </div>

        <div className="w-full h-4 bg-(--bg-muted) rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1 }}
            className="h-4 bg-(--color-primary) rounded-full"
          />
        </div>
      </div>

      {/* COURSE PROGRESS */}
      <div className="bg-(--card-bg) border border-(--border-color) p-8 rounded-3xl mb-10">
        <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
          <FiBookOpen />
          Course Performance
        </h2>

        <div className="space-y-6">
          {courseProgress.map((course) => (
            <div key={course._id}>
              <div className="flex justify-between mb-2">
                <span>{course.name}</span>
                <span>{course.progress}%</span>
              </div>

              <div className="w-full h-3 bg-(--bg-muted) rounded-full">
                <div
                  className="h-3 bg-(--color-accent) rounded-full"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUIZ + ASSIGNMENT */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="bg-(--card-bg) border border-(--border-color) p-8 rounded-3xl">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <FiActivity />
            Quiz Performance
          </h2>
          <div className="text-4xl font-semibold text-(--color-success)">
            {avgQuizScore}%
          </div>
        </div>

        <div className="bg-(--card-bg) border border-(--border-color) p-8 rounded-3xl">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <FiAward />
            Assignment Performance
          </h2>
          <div className="text-4xl font-semibold text-(--color-primary)">
            {avgAssignmentScore}%
          </div>
        </div>
      </div>

      {/* SKILLS */}
      <div className="bg-(--card-bg) border border-(--border-color) p-8 rounded-3xl mb-10">
        <h2 className="text-lg font-medium mb-6">
          Skills Acquired
        </h2>

        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-(--bg-muted) rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* AI INSIGHT */}
      <div className="bg-(--card-bg) border border-(--border-color) p-8 rounded-3xl">
        <h2 className="text-lg font-medium mb-4">
          AI Learning Insight
        </h2>
        <p className="text-(--text-secondary)">
          {insight}
        </p>
      </div>

    </div>
  );
};

export default StudentProgress;