import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiLink } from "react-icons/fi";
import { useParams } from "react-router-dom";
import api from "../../config/api";
import { toast } from "react-hot-toast";

const AssignmentPage = () => {
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

  /* ================= FETCH ASSIGNMENT ================= */

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await api.get(`/student/assignments/${id}`);
        setAssignment(res.data);
        setStatus(res.data.status);
        setMarks(res.data.marks);
        setFeedback(res.data.feedback);
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
      toast.error("Please submit at least one format.");
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
    } catch (error) {
      console.log("Submission error:", error);
      toast.error("Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        Loading assignment...
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        Assignment not found
      </div>
    );
  }

  const deadlineDate = new Date(assignment.deadline);
  const isLate = new Date() > deadlineDate;

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-3 md:px-16 pt-20 md:pt-32 pb-16">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">{assignment.title}</h1>

        <p className="text-(--text-secondary) mt-2">
          Deadline: {deadlineDate.toLocaleString()}
        </p>

        <div
          className={`mt-3 inline-block px-4 py-1 rounded-full text-sm ${
            status === "Evaluated"
              ? "bg-(--color-success) text-white"
              : status === "Submitted"
                ? "bg-(--color-warning) text-white"
                : isLate
                  ? "bg-(--color-danger) text-white"
                  : "bg-(--color-accent) text-white"
          }`}
        >
          {status}
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl mb-10">
        <h3 className="font-semibold mb-2">Assignment Description</h3>
        <p className="text-(--text-secondary)">{assignment.description}</p>
      </div>

      {/* SUBMISSION SECTION */}
      {status === "Pending" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl space-y-6"
        >
          {/* TEXT */}
          <div>
            <label className="font-medium">Text Submission</label>
            <textarea
              value={textSubmission}
              onChange={(e) => setTextSubmission(e.target.value)}
              rows={4}
              className="w-full mt-2 p-3 rounded-xl border border-(--border-color) bg-(--bg-muted) disabled:cursor-not-allowed"
              placeholder="Write explanation or paste code..."
              disabled={submitting}
            />
          </div>

          {/* LINK */}
          <div>
            <label className="font-medium">External Link</label>
            <div className="flex mt-2 gap-2">
              <FiLink className="mt-3" />
              <input
                type="text"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                className="flex-1 p-3 rounded-xl border border-(--border-color) bg-(--bg-muted) disabled:cursor-not-allowed"
                placeholder="GitHub / Live Demo"
                disabled={submitting}
              />
            </div>
          </div>

          {/* FILE */}
          <div>
            <label className="font-medium disabled:cursor-not-allowed">
              Upload File
            </label>
            <div className="mt-2 flex items-center gap-3">
              <FiUpload />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                disabled={submitting}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-(--color-primary) text-white rounded-xl hover:bg-(--color-primary-hover) disabled:bg-slate-400 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Assignment"}
          </button>
        </motion.div>
      )}

      {/* EVALUATION SECTION */}
      {status !== "Pending" && (
        <>
          <div className="mt-10 bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl">
            {status === "Evaluated" ? (
              <>
                <h3 className="font-semibold mb-3">Evaluation</h3>

                <div className="text-lg">
                  Marks:
                  <span className="ml-2 text-(--color-success) font-bold">
                    {marks}/{assignment.maxMarks}
                  </span>
                </div>

                <p className="mt-3 text-(--text-secondary)">
                  Feedback: {feedback}
                </p>
              </>
            ) : (
              <p className="text-(--text-secondary)">
                Submission received. Awaiting evaluation.
              </p>
            )}
          </div>

          <div className="mt-10 bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl ">
            <h3 className="font-semibold text-lg">Your Submission</h3>

            {/* Submitted Time */}
            {assignment.submittedAt && (
              <p className="text-sm text-(--text-muted) mb-4">
                Submitted on:{" "}
                {new Date(assignment.submittedAt).toLocaleString()}
              </p>
            )}

            {/* TEXT */}
            {assignment.content && (
              <div className="bg-(--bg-muted) p-4 rounded-xl mb-4">
                <h4 className="font-medium mb-2">Text Submission</h4>
                <p className="text-(--text-secondary) whitespace-pre-wrap">
                  {assignment.content}
                </p>
              </div>
            )}

            {/* LINK */}
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

            {/* FILE */}
            {assignment.file?.url && (
              <div className="bg-(--bg-muted) p-4 rounded-xl  mb-4">
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
          </div>
        </>
      )}
    </div>
  );
};

export default AssignmentPage;
