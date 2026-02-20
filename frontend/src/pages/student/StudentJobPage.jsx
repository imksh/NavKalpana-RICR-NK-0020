import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const StudentJobPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  // Dummy job (replace with API fetch)
  const job = {
    title: "Frontend Developer Intern",
    company: "Infosys",
    location: "Remote",
    type: "Internship",
    stipend: "₹15,000/month",
    skills: ["React", "JavaScript"],
    deadline: "2026-03-15"
  };

  const handleSubmit = async () => {
    if (!resume) {
      alert("Please upload your resume");
      return;
    }

    setLoading(true);

    // 🔥 Replace with backend API
    setTimeout(() => {
      setLoading(false);
      alert("Application Submitted Successfully 🎉");
      navigate("/student/jobs");
    }, 1200);
  };

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">

      <h1 className="text-3xl font-semibold mb-10">
        Apply for {job.title}
      </h1>

      <div className="grid md:grid-cols-3 gap-10">

        {/* LEFT - JOB DETAILS */}
        <div className="md:col-span-1 bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl shadow-sm">

          <h3 className="text-lg font-semibold mb-3">
            {job.company}
          </h3>

          <p className="text-(--text-secondary) text-sm mb-4">
            {job.location} • {job.type}
          </p>

          <div className="mb-4">
            <p className="text-sm font-medium">
              Compensation:
            </p>
            <p className="text-(--color-success)">
              {job.stipend}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium">
              Required Skills:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1 bg-(--bg-muted) rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm text-(--text-muted)">
            Deadline: {job.deadline}
          </p>
        </div>

        {/* RIGHT - APPLY FORM */}
        <div className="md:col-span-2 bg-(--card-bg) border border-(--border-color) p-8 rounded-2xl shadow-sm">

          {/* Resume Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Upload Resume (PDF)
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setResume(e.target.files[0])
              }
              className="w-full border border-(--border-color) rounded-xl p-3 bg-(--bg-main)"
            />
          </div>

          {/* Cover Letter */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">
              Cover Letter
            </label>

            <textarea
              rows="6"
              value={coverLetter}
              onChange={(e) =>
                setCoverLetter(e.target.value)
              }
              placeholder="Write why you are suitable for this role..."
              className="w-full border border-(--border-color) rounded-xl p-4 bg-(--bg-main)"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl bg-(--bg-muted)"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-(--color-primary) text-white hover:opacity-90"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default StudentJobPage;