import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import useUiStore from "../../store/useUiStore";

const StudentJobPage = () => {
  const { t } = useTranslation();
  const { lang } = useUiStore();
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const getLocalizedText = (value) => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
      return value[lang] || value.en || Object.values(value)[0] || "";
    }
    return "";
  };

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
      toast.error(t("studentJobPage.toast.uploadResume"));
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("jobId", id);
      formData.append("resume", resume);
      formData.append("coverLetter", coverLetter);

      await api.post(`/jobs/${id}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(t("studentJobPage.toast.submitted"));
      navigate("/student/jobs");
    } catch (error) {
      toast.error(
        error.response?.data?.message || t("studentJobPage.toast.error"),
      );
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <div>{t("studentJobPage.loading")}</div>;

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">
      <h1 className="text-3xl font-semibold mb-10">
        {t("studentJobPage.applyFor", { title: getLocalizedText(job.title) })}
      </h1>

      <div className="grid md:grid-cols-3 gap-10">
        {/* LEFT - JOB DETAILS */}
        <div className="md:col-span-1 bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-3">{job.company}</h3>

          <p className="text-(--text-secondary) text-sm mb-4">
            {getLocalizedText(job.location)} • {job.type}
          </p>

          <p className="text-(--text-secondary) text-sm mb-4">
            {getLocalizedText(job.description)
              .split("\n")
              .map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
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

          <div className="flex mt-6 mb-2 gap-4 items-center">
            <h4 className="font-medium ">{t("studentJobPage.deadline")}:</h4>
            <p className="text-sm text-(--text-secondary)">
              {new Date(job.deadline).toLocaleDateString()}
            </p>
          </div>

          {job.status === "close" && (
            <div className="text-xs bg-(--color-danger) px-4 py-1 rounded-2xl my-2 w-fit">
              {t("studentJobPage.closed")}
            </div>
          )}

          {job.hasApplied && (
            <>
              <h4 className="font-medium mb-2">
                {t("studentJobPage.yourApplication")}
              </h4>

              <p className="mb-1">
                <span className="font-medium">
                  {t("studentJobPage.status")}:
                </span>{" "}
                <span
                  className={`font-medium ${
                    job.applicationStatus === "Accepted"
                      ? "text-(--color-success)"
                      : job.applicationStatus === "Rejected"
                        ? "text-(--color-error)"
                        : "text-(--color-primary)"
                  }`}
                >
                  {job.applicationStatus}
                </span>
              </p>

              <p className="mb-1">
                <p className="font-medium">
                  {t("studentJobPage.coverLetter")}:
                </p>{" "}
                <p className="text-(--text-secondary) text-sm mb-4">
                  {job.coverLetter || t("studentJobPage.na")}
                </p>
              </p>

              {job.resume && (
                <a
                  href={job.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--color-primary) underline text-sm"
                >
                  {t("studentJobPage.viewResume")}
                </a>
              )}
            </>
          )}
        </div>

        {/* RIGHT - APPLY FORM */}
        <div className="md:col-span-2 bg-(--card-bg) border border-(--border-color) p-8 rounded-2xl">
          <div className="mb-6">
            <label className="block mb-2 text-sm">
              {t("studentJobPage.uploadResume")}
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
              className="w-full border border-(--border-color) rounded-xl p-3 bg-(--bg-main) disabled:cursor-not-allowed"
              disabled={job.hasApplied || job.status === "close"}
            />
          </div>

          <div className="mb-8">
            <label className="block mb-2 text-sm">
              {t("studentJobPage.coverLetter")}
            </label>

            <textarea
              rows="6"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full border border-(--border-color) rounded-xl p-4 bg-(--bg-main) disabled:cursor-not-allowed "
              disabled={job.hasApplied || job.status === "close"}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl bg-(--bg-muted)"
            >
              {t("studentJobPage.cancel")}
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading || job.hasApplied || job.status === "close"}
              className="px-6 py-3 rounded-xl bg-(--color-primary) text-white disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading
                ? t("studentJobPage.submitting")
                : job.status === "close"
                  ? t("studentJobPage.jobClosed")
                  : t("studentJobPage.submitApplication")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentJobPage;
