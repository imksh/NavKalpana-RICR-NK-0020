import { useState } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiLink } from "react-icons/fi";

const AssignmentPage = () => {
  const assignment = {
    title: "Build a React Todo App",
    description:
      "Create a fully functional Todo application using React. Implement add, delete and mark complete functionality.",
    deadline: "2026-02-25T23:59:59",
    maxMarks: 100
  };

  const [textSubmission, setTextSubmission] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [marks, setMarks] = useState(null);
  const [feedback, setFeedback] = useState("");

  const deadlineDate = new Date(assignment.deadline);
  const isLate = new Date() > deadlineDate;

  const handleSubmit = () => {
    if (!textSubmission && !externalLink && !file) {
      alert("Please submit at least one format.");
      return;
    }

    setSubmitted(true);

    // Dummy evaluation
    setTimeout(() => {
      setMarks(85);
      setFeedback("Good implementation. Improve UI responsiveness.");
    }, 1500);
  };

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

        <div className={`mt-3 inline-block px-4 py-1 rounded-full text-sm ${
          submitted
            ? "bg-(--color-success) text-white"
            : isLate
            ? "bg-(--color-danger) text-white"
            : "bg-(--color-accent) text-white"
        }`}>
          {submitted
            ? "Submitted"
            : isLate
            ? "Late Submission"
            : "Pending"}
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
      {!submitted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl space-y-6"
        >

          {/* TEXT SUBMISSION */}
          <div>
            <label className="font-medium">Text Submission</label>
            <textarea
              value={textSubmission}
              onChange={(e) => setTextSubmission(e.target.value)}
              rows={4}
              className="w-full mt-2 p-3 rounded-xl border border-(--border-color) bg-(--bg-muted)"
              placeholder="Write your explanation or paste code..."
            />
          </div>

          {/* LINK SUBMISSION */}
          <div>
            <label className="font-medium">External Link</label>
            <div className="flex mt-2 gap-2">
              <FiLink className="mt-3" />
              <input
                type="text"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                className="flex-1 p-3 rounded-xl border border-(--border-color) bg-(--bg-muted)"
                placeholder="GitHub / Live Demo Link"
              />
            </div>
          </div>

          {/* FILE UPLOAD */}
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

      {/* EVALUATION */}
      {submitted && (
        <div className="mt-10 bg-(--card-bg) border border-(--border-color) p-6 rounded-2xl">

          {marks !== null ? (
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