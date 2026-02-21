import { useEffect, useState } from "react";
import { FiMapPin, FiClock, FiBookmark } from "react-icons/fi";
import api from "../../config/api";
import { useNavigate } from "react-router-dom";

const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState(
    JSON.parse(localStorage.getItem("bookmarkedJobs") || "[]"),
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (filter === "Applied") {
      const appliedJobs = jobs.filter((job) => job.hasApplied);
      setFilteredJobs(appliedJobs);
    } else if (filter === "Bookmarked") {
      const bookmarked = jobs.filter((job) =>
        bookmarkedJobs.some((b) => b._id === job._id),
      );
      setFilteredJobs(bookmarked);
    } else {
      const filtered = jobs.filter(
        (job) => job.type === filter || filter === "All",
      );
      setFilteredJobs(filtered);
    }
  }, [filter, jobs, bookmarkedJobs]);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/jobs");
      setJobs(res.data);
    };
    fetch();
  }, []);

  const handleBookmark = (job) => {
    const isBookmarked = bookmarkedJobs.find((item) => item._id === job._id);

    if (isBookmarked) {
      const updatedBookmarkedJobs = bookmarkedJobs.filter(
        (item) => item._id !== job._id,
      );
      localStorage.setItem(
        "bookmarkedJobs",
        JSON.stringify(updatedBookmarkedJobs),
      );
      setBookmarkedJobs(updatedBookmarkedJobs);
    } else {
      const updatedBookmarkedJobs = [job, ...bookmarkedJobs];
      localStorage.setItem(
        "bookmarkedJobs",
        JSON.stringify(updatedBookmarkedJobs),
      );
      setBookmarkedJobs(updatedBookmarkedJobs);
    }
  };

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-3 md:px-16 pt-20 md:pt-32 pb-16">
      <h1 className="text-3xl font-semibold mb-10">Jobs & Internships</h1>

      {/* FILTER */}
      <div className="flex gap-1 md:gap-4 mb-10 overflow-auto hide-scrollbar">
        {["All", "Internship", "Full-Time", "Applied", "Bookmarked"].map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-1.5 py-1 md:px-5 md:py-2 rounded-full text-nowrap text-sm ${
                filter === type
                  ? "bg-(--color-primary) text-white"
                  : "bg-(--bg-muted)"
              }`}
            >
              {type}
            </button>
          ),
        )}
      </div>

      {/* JOB LIST */}
      <div className="grid md:grid-cols-2 gap-8">
        {filteredJobs?.map((job) => (
          <div
            key={job._id}
            className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl shadow-sm"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-(--text-secondary) text-sm">{job.company}</p>
              </div>
              <button
                onClick={() => handleBookmark(job)}
                className="flex flex-col items-center justify-center gap-1"
              >
                <FiBookmark
                  className={
                    bookmarkedJobs?.find((item) => item._id === job._id)
                      ? "text-(--color-primary)"
                      : "text-(--text-secondary)"
                  }
                />
              </button>
            </div>

            <div className="flex gap-4 text-sm mt-4 text-(--text-secondary)">
              <span className="flex items-center gap-1">
                <FiMapPin size={14} /> {job.location}
              </span>
              <span className="flex items-center gap-1">
                <FiClock size={14} />
                Deadline: {new Date(job.deadline).toLocaleDateString()}
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
            {job.status === "close" && (
              <div className="text-xs bg-(--color-danger) px-4 py-1 rounded-2xl my-2 w-fit">
                Closed
              </div>
            )}
            <div className="mt-6 flex justify-between items-center">
              <p className="font-medium text-(--color-success)">
                {job.stipend || job.salary}
              </p>

              <button
                onClick={() => navigate(`/student/jobs/${job._id}`)}
                className={`px-5 py-2  text-white rounded-xl ${job.hasApplied ? "bg-(--color-success)" : job.status === "open" ? "bg-(--color-primary)" : "bg-(--color-danger)"} `}
              >
                {job.hasApplied
                  ? "View"
                  : job.status === "open"
                    ? "Apply Now"
                    : "View"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentJobs;
