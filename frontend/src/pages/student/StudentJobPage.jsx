import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";

const StudentJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH JOB ================= */
  useEffect(() => {
    const fetch = async () => {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);
    };
    fetch();
  }, [id]);

  const handleSubmit = async () => {
    if (!resume) {
      alert("Please upload your resume");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("resume", resume);
      formData.append("coverLetter", coverLetter);

      await api.post("/job/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Application Submitted Successfully 🎉");
      navigate("/student/jobs");
    } catch (error) {
      alert(error.response?.data?.message || "Error applying");
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">
      <h1 className="text-3xl font-semibold mb-10">
        Apply for {job.title}
      </h1>

      <div className="grid md:grid-cols-3 gap-10">
        {/* LEFT - JOB DETAILS */}
        <div className="md:col-span-1 bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-3">
            {job.company}
          </h3>

          <p className="text-(--text-secondary) text-sm mb-4">
            {job.location} • {job.type}
          </p>

          <p className="text-(--color-success) mb-4">
            {job.stipend || job.salary}
          </p>

          <div className="flex flex-wrap gap-2">
            {job.skills?.map((skill, index) => (
              <span
                key={index}
                className="text-xs px-3 py-1 bg-(--bg-muted) rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT - APPLY FORM */}
        <div className="md:col-span-2 bg-(--card-bg) border border-(--border-color) p-8 rounded-2xl">
          <div className="mb-6">
            <label className="block mb-2 text-sm">
              Upload Resume (PDF)
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
              className="w-full border border-(--border-color) rounded-xl p-3 bg-(--bg-main)"
            />
          </div>

          <div className="mb-8">
            <label className="block mb-2 text-sm">
              Cover Letter
            </label>

            <textarea
              rows="6"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full border border-(--border-color) rounded-xl p-4 bg-(--bg-main)"
            />
          </div>

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
              className="px-6 py-3 rounded-xl bg-(--color-primary) text-white"
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