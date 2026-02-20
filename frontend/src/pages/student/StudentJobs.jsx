import { useState } from "react";
import { FiMapPin, FiClock, FiBookmark } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const jobsData = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "Infosys",
    location: "Remote",
    type: "Internship",
    skills: ["React", "JavaScript"],
    stipend: "₹15,000/month",
    deadline: "2026-03-15",
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "TCS",
    location: "Bangalore",
    type: "Full-Time",
    skills: ["Node.js", "MongoDB"],
    salary: "₹6 LPA",
    deadline: "2026-03-10",
  },
];

const StudentJobs = () => {
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const filteredJobs =
    filter === "All" ? jobsData : jobsData.filter((job) => job.type === filter);

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">
      {/* TITLE */}
      <h1 className="text-3xl font-semibold mb-10">Jobs & Internships</h1>

      {/* FILTER */}
      <div className="flex gap-4 mb-10">
        {["All", "Internship", "Full-Time"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-5 py-2 rounded-full text-sm ${
              filter === type
                ? "bg-(--color-primary) text-white"
                : "bg-(--bg-muted)"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* JOB LIST */}
      <div className="grid md:grid-cols-2 gap-8">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-(--text-secondary) text-sm">{job.company}</p>
              </div>

              <FiBookmark className="cursor-pointer text-(--text-muted)" />
            </div>

            <div className="flex gap-4 text-sm mt-4 text-(--text-secondary)">
              <span className="flex items-center gap-1">
                <FiMapPin size={14} /> {job.location}
              </span>
              <span className="flex items-center gap-1">
                <FiClock size={14} /> Deadline: {job.deadline}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 bg-(--bg-muted) rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <p className="font-medium text-(--color-success)">
                {job.stipend || job.salary}
              </p>

              <button onClick={()=>navigate(`/student/jobs/${job.id}`)} className="px-5 py-2 bg-(--color-primary) text-white rounded-xl hover:opacity-90">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentJobs;
