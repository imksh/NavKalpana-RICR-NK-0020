import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiLink } from "react-icons/fi";
import { useParams } from "react-router-dom";
import api from "../../config/api";

const AssignmentPage = () => {
  const { id } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

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
      alert("Please submit at least one format.");
      return;
    }

    try {
      const formData = new FormData();

      if (textSubmission) {
        formData.append("submissionType", "text");
        formData.append("content", textSubmission);
      }

      if (externalLink) {
        formData.append("submissionType", "link");
        formData.append("content", externalLink);
      }

      if (file) {
        formData.append("submissionType", "file");
        formData.append("file", file);
      }

      await api.post(`/student/assignments/${id}/submit`, formData);

      setStatus("Submitted");
    } catch (error) {
      console.log("Submission error:", error);
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
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">
          {assignment.title}
        </h1>

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
        <p className="text-(--text-secondary)">
          {assignment.description}
        </p>
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
              className="w-full mt-2 p-3 rounded-xl border border-(--border-color) bg-(--bg-muted)"
              placeholder="Write explanation or paste code..."
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
                className="flex-1 p-3 rounded-xl border border-(--border-color) bg-(--bg-muted)"
                placeholder="GitHub / Live Demo"
              />
            </div>
          </div>

          {/* FILE */}
          <div>
            <label className="font-medium">Upload File</label>
            <div className="mt-2 flex items-center gap-3">
              <FiUpload />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-(--color-primary) text-white rounded-xl hover:bg-(--color-primary-hover)"
          >
            Submit Assignment
          </button>
        </motion.div>
      )}

      {/* EVALUATION SECTION */}
      {status !== "Pending" && (
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
      )}
    </div>
  );
};

export default AssignmentPage;