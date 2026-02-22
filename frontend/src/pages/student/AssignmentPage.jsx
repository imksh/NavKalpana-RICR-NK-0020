import { useState, useEffect } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiLink,
  FiUpload,
} from "react-icons/fi";
import { useParams } from "react-router-dom";
import api from "../../config/api";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const AssignmentPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [textSubmission, setTextSubmission] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [file, setFile] = useState(null);

  const [status, setStatus] = useState("Pending");
  const [marks, setMarks] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [courseStats, setCourseStats] = useState({
    total: 0,
    pending: 0,
    evaluated: 0,
  });

  /* ================= FETCH ASSIGNMENT ================= */

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const [detailRes, listRes] = await Promise.all([
          api.get(`/student/assignments/${id}`),
          api.get("/student/assignments"),
        ]);

        const detail = detailRes.data;
        const allAssignments = listRes.data || [];

        setAssignment(detail);
        setStatus(detail.status);
        setMarks(detail.marks);
        setFeedback(detail.feedback);

        const sameCourse = allAssignments.filter(
          (item) => item.course === detail.course,
        );
        setCourseStats({
          total: sameCourse.length,
          pending: sameCourse.filter((item) => item.status === "Pending")
            .length,
          evaluated: sameCourse.filter((item) => item.status === "Evaluated")
            .length,
        });
      } catch (error) {
        console.log("Error fetching assignment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  /* ================= SUBMIT ASSIGNMENT ================= */

  const handleSubmit = async () => {
    if (!textSubmission && !externalLink && !file) {
      toast.error(t("assignmentPage.toast.oneFormat"));
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();

      formData.append("file", file);
      formData.append("link", externalLink);
      formData.append("content", textSubmission);

      const res = await api.post(`/student/assignments/${id}/submit`, formData);

      setStatus(res.data.status);
      setAssignment((prev) => ({
        ...prev,
        content: textSubmission || null,
        link: externalLink || null,
        submittedAt: new Date().toISOString(),
      }));
      toast.success(t("assignmentPage.toast.submitted"));
    } catch (error) {
      console.log("Submission error:", error);
      toast.error(t("assignmentPage.toast.failed"));
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= RENDER ================= */

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        {t("assignmentPage.loading")}
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        {t("assignmentPage.notFound")}
      </div>
    );
  }

  const deadlineDate = new Date(assignment.deadline);
  const isLate = Date.now() > deadlineDate.getTime();
  const timeDiff = deadlineDate.getTime() - Date.now();
  const daysLeft = Math.ceil(Math.abs(timeDiff) / (1000 * 60 * 60 * 24));

  const submissionReady = !!(textSubmission || externalLink || file);

  const getStatusBadgeClass = () => {
    if (status === "Evaluated") return "bg-green-600 text-white";
    if (status === "Submitted") return "bg-yellow-600 text-white";
    if (status === "Late Submitted") return "bg-red-600 text-white";
    if (isLate) return "bg-red-600 text-white";
    return "bg-blue-600 text-white";
  };

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-4 md:px-10 lg:px-16 pt-10 md:pt-14 pb-16 space-y-7">
      {/* HERO SECTION */}
      <section className="rounded-3xl border border-(--border-color) bg-(--bg-surface) p-6 md:p-8 shadow-sm">
        <div className="grid lg:grid-cols-3 gap-5 md:gap-6">
          <div className="lg:col-span-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-(--border-color) bg-(--bg-muted) px-3 py-1 text-xs md:text-sm text-(--text-secondary)">
              <FiFileText size={14} /> {t("assignmentPage.badge")}
            </span>

            <h1 className="text-2xl md:text-4xl font-semibold mt-4 leading-tight">
              {assignment.title}
            </h1>

            <p className="text-(--text-secondary) mt-3">
              {t("assignmentPage.course")}:{" "}
              {assignment.course || t("common.na")} •{" "}
              {t("assignmentPage.module")}:{" "}
              {assignment.module || t("common.na")}
            </p>

            <p className="text-(--text-secondary) mt-1 inline-flex items-center gap-2">
              <FiClock size={14} />
              {t("assignmentPage.deadline")}: {deadlineDate.toLocaleString()}
            </p>

            <div
              className={`mt-4 inline-block px-4 py-1 rounded-full text-sm ${getStatusBadgeClass()}`}
            >
              {status}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-3">
            <InfoCard
              label={t("assignmentPage.maxMarks")}
              value={assignment.maxMarks || 0}
            />
            <InfoCard
              label={
                timeDiff >= 0
                  ? t("assignmentPage.timeLeft")
                  : t("assignmentPage.pastDeadline")
              }
              value={`${daysLeft} day${daysLeft === 1 ? "" : "s"}`}
              danger={timeDiff < 0}
            />
            <InfoCard
              label={t("assignmentPage.workload")}
              value={`${courseStats.pending} pending / ${courseStats.total} total`}
            />
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl">
        <h3 className="font-semibold mb-2">
          {t("assignmentPage.description")}
        </h3>
        <p className="text-(--text-secondary)">{assignment.description}</p>
      </section>

      {/* SUBMISSION FORM */}
      {status === "Pending" && (
        <section className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl space-y-6">
          <h3 className="font-semibold text-lg">
            {t("assignmentPage.submitWork")}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="font-medium">
                {t("assignmentPage.textSubmission")}
              </label>
              <textarea
                value={textSubmission}
                onChange={(e) => setTextSubmission(e.target.value)}
                rows={5}
                className="w-full mt-2 p-3 rounded-xl border border-(--border-color) bg-(--bg-muted) disabled:cursor-not-allowed"
                placeholder={t("assignmentPage.textPlaceholder")}
                disabled={submitting}
              />
            </div>

            <div>
              <label className="font-medium">
                {t("assignmentPage.externalLink")}
              </label>
              <div className="flex mt-2 gap-2 items-center">
                <FiLink className="text-(--text-secondary)" />
                <input
                  type="text"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  className="flex-1 p-3 rounded-xl border border-(--border-color) bg-(--bg-muted) disabled:cursor-not-allowed"
                  placeholder={t("assignmentPage.linkPlaceholder")}
                  disabled={submitting}
                />
              </div>
            </div>

            <div>
              <label className="font-medium">
                {t("assignmentPage.uploadFile")}
              </label>
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-(--border-color) bg-(--bg-muted) p-3">
                <FiUpload />
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  disabled={submitting}
                />
              </div>

              {file && (
                <p className="text-xs text-(--text-secondary) mt-2">
                  {t("assignmentPage.selected")}: {file.name}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-(--border-color) bg-(--bg-surface) p-4">
            <p className="font-medium mb-2">{t("assignmentPage.checklist")}</p>
            <ul className="space-y-2 text-sm text-(--text-secondary)">
              <li className="inline-flex items-center gap-2">
                {submissionReady ? (
                  <FiCheckCircle className="text-green-600" />
                ) : (
                  <FiAlertCircle className="text-yellow-600" />
                )}
                {t("assignmentPage.checkItem1")}
              </li>
              <li className="inline-flex items-center gap-2">
                <FiCheckCircle className="text-green-600" />
                {t("assignmentPage.checkItem2")}
              </li>
            </ul>
          </div>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-(--color-primary) text-white rounded-xl hover:bg-(--color-primary-hover) disabled:bg-slate-400 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting
              ? t("assignmentPage.submitting")
              : t("assignmentPage.submit")}
          </button>
        </section>
      )}

      {/* EVALUATION & SUBMISSION REVIEW */}
      {status !== "Pending" && (
        <>
          <section className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl">
            {status === "Evaluated" ? (
              <>
                <h3 className="font-semibold mb-3">Evaluation</h3>

                <div className="text-lg">
                  Marks:
                  <span className="ml-2 text-green-600 font-bold">
                    {marks}/{assignment.maxMarks}
                  </span>
                </div>

                <p className="mt-3 text-(--text-secondary)">
                  Feedback: {feedback || "No feedback available."}
                </p>
              </>
            ) : (
              <p className="text-(--text-secondary)">
                Submission received. Awaiting evaluation.
              </p>
            )}
          </section>

          <section className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl">
            <h3 className="font-semibold text-lg">Your Submission</h3>

            {assignment.submittedAt && (
              <p className="text-sm text-(--text-muted) mb-4 mt-1">
                Submitted on:{" "}
                {new Date(assignment.submittedAt).toLocaleString()}
              </p>
            )}

            {assignment.content && (
              <div className="bg-(--bg-muted) p-4 rounded-xl mb-4">
                <h4 className="font-medium mb-2">Text Submission</h4>
                <p className="text-(--text-secondary) whitespace-pre-wrap">
                  {assignment.content}
                </p>
              </div>
            )}

            {assignment.link && (
              <div className="bg-(--bg-muted) p-4 rounded-xl mb-4">
                <h4 className="font-medium mb-2">External Link</h4>

                <a
                  href={
                    assignment.link.startsWith("http")
                      ? assignment.link
                      : `https://${assignment.link}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--color-primary) underline break-all"
                >
                  {assignment.link}
                </a>
              </div>
            )}

            {assignment.file?.url && (
              <div className="bg-(--bg-muted) p-4 rounded-xl mb-4">
                <h4 className="font-medium mb-2">Uploaded File</h4>
                <a
                  href={assignment.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 inline-block bg-(--color-primary) text-white rounded-xl hover:opacity-90"
                >
                  View / Download File
                </a>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

const InfoCard = ({ label, value, danger }) => (
  <div className="rounded-xl border border-(--border-color) bg-(--card-bg) p-3">
    <p className="text-xs text-(--text-muted)">{label}</p>
    <p className={`font-semibold mt-1 ${danger ? "text-red-600" : ""}`}>
      {value}
    </p>
  </div>
);

export default AssignmentPage;
