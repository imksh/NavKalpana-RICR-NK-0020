import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  FiMessageCircle,
  FiCalendar,
  FiLoader,
  FiAlertCircle,
  FiRefreshCw,
  FiInbox,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";
import CloseButton from "../../CloseButton";
import useUiStore from "../../../store/useUiStore";
import api from "../../../config/api";
import toast from "react-hot-toast";

const _MotionRef = motion;

const StudentSupportTrackerModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("doubts");
  const { setIsModal } = useUiStore();
  const [doubts, setDoubts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [doubtsRes, sessionsRes] = await Promise.all([
        api.get("/student/doubts"),
        api.get("/student/sessions"),
      ]);
      setDoubts(doubtsRes.data);
      setSessions(sessionsRes.data);
    } catch (error) {
      console.error("Error fetching support data:", error);
      setError(t("studentModals.supportTracker.errorLoading"));
      toast.error(t("studentModals.supportTracker.errorLoading"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, fetchData]);

  useEffect(() => {
    if (isOpen) {
      setIsModal(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setIsModal(false);
    }

    return () => {
      document.body.style.overflow = "auto";
      setIsModal(false);
    };
  }, [isOpen, setIsModal]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Answered":
      case "Approved":
        return <FiCheckCircle size={14} />;
      case "Pending":
        return <FiClock size={14} />;
      case "Rejected":
      case "Closed":
        return <FiXCircle size={14} />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t("studentModals.supportTracker.today");
    if (diffDays === 1) return t("studentModals.supportTracker.yesterday");
    if (diffDays < 7)
      return `${diffDays} ${t("studentModals.supportTracker.daysAgo")}`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Answered":
      case "Approved":
        return "bg-(--color-success)";
      case "Pending":
        return "bg-(--color-warning)";
      case "Rejected":
      case "Closed":
        return "bg-(--color-danger)";
      default:
        return "bg-(--bg-muted)";
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      Answered: t("studentModals.supportTracker.statusAnswered"),
      Approved: t("studentModals.supportTracker.statusApproved"),
      Pending: t("studentModals.supportTracker.statusPending"),
      Rejected: t("studentModals.supportTracker.statusRejected"),
      Closed: t("studentModals.supportTracker.statusClosed"),
    };
    return statusMap[status] || status;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 flex items-center justify-center px-4 z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-(--card-bg) border border-(--border-color)
                         w-full max-w-2xl rounded-3xl
                         h-[80vh] flex flex-col relative"
            >
              {/* ===== HEADER ===== */}
              <div className="p-6 border-b border-(--border-color) relative">
                <div className="absolute top-6 right-6">
                  <CloseButton onClose={onClose} />
                </div>

                <h2 className="text-xl font-semibold text-center">
                  {t("studentModals.supportTracker.title")}
                </h2>

                {/* Tabs */}
                <div className="flex justify-center mt-4 gap-4">
                  <button
                    onClick={() => setActiveTab("doubts")}
                    disabled={loading}
                    className={`px-4 py-2 rounded-xl text-sm transition-all relative ${
                      activeTab === "doubts"
                        ? "bg-(--color-primary) text-white shadow-lg shadow-(--color-primary)/20"
                        : "bg-(--bg-muted) hover:bg-(--bg-muted)/80"
                    }`}
                  >
                    <FiMessageCircle className="inline mr-2" />
                    {t("studentModals.supportTracker.tabDoubts")}
                    {doubts.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                        {doubts.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab("sessions")}
                    disabled={loading}
                    className={`px-4 py-2 rounded-xl text-sm transition-all relative ${
                      activeTab === "sessions"
                        ? "bg-(--color-primary) text-white shadow-lg shadow-(--color-primary)/20"
                        : "bg-(--bg-muted) hover:bg-(--bg-muted)/80"
                    }`}
                  >
                    <FiCalendar className="inline mr-2" />
                    {t("studentModals.supportTracker.tabSessions")}
                    {sessions.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                        {sessions.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* ===== BODY (SCROLLABLE) ===== */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {loading ? (
                  <LoadingState />
                ) : error ? (
                  <ErrorState error={error} onRetry={fetchData} />
                ) : activeTab === "doubts" ? (
                  <motion.div
                    key="doubts"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {doubts.length === 0 ? (
                      <EmptyState
                        icon={<FiMessageCircle size={48} />}
                        text={t("studentModals.supportTracker.noDoubts")}
                        subtext={t(
                          "studentModals.supportTracker.noDoubtsSubtext",
                        )}
                      />
                    ) : (
                      doubts.map((doubt, index) => (
                        <motion.div
                          key={doubt._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border border-(--border-color) rounded-2xl p-4 bg-(--bg-main) hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold flex-1">
                              {doubt.subject}
                            </h3>
                            <span
                              className={`text-xs px-3 py-1 rounded-full text-white flex items-center gap-1 ${getStatusColor(
                                doubt.status,
                              )}`}
                            >
                              {getStatusIcon(doubt.status)}
                              {getStatusLabel(doubt.status)}
                            </span>
                          </div>

                          <p className="text-sm text-(--text-secondary) mb-2 line-clamp-2">
                            {doubt.message}
                          </p>

                          {doubt.reply && (
                            <div className="mt-3 p-3 rounded-xl bg-(--bg-muted) border-l-4 border-(--color-success)">
                              <p className="text-xs text-(--text-secondary) mb-1 font-medium">
                                {t(
                                  "studentModals.supportTracker.instructorReply",
                                )}
                              </p>
                              <p className="text-sm">{doubt.reply}</p>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-(--text-muted)">
                              {formatDate(doubt.createdAt)}
                            </p>
                            {doubt.instructor && (
                              <p className="text-xs text-(--text-muted)">
                                {doubt.instructor.name}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="sessions"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {sessions.length === 0 ? (
                      <EmptyState
                        icon={<FiCalendar size={48} />}
                        text={t("studentModals.supportTracker.noSessions")}
                        subtext={t(
                          "studentModals.supportTracker.noSessionsSubtext",
                        )}
                      />
                    ) : (
                      sessions.map((session, index) => (
                        <motion.div
                          key={session._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border border-(--border-color) rounded-2xl p-4 bg-(--bg-main) hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold flex-1">
                              {session.topic}
                            </h3>
                            <span
                              className={`text-xs px-3 py-1 rounded-full text-white flex items-center gap-1 ${getStatusColor(
                                session.status,
                              )}`}
                            >
                              {getStatusIcon(session.status)}
                              {getStatusLabel(session.status)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-(--text-secondary) mb-2">
                            <FiCalendar size={14} />
                            <span>{new Date(session.date).toDateString()}</span>
                            <span>•</span>
                            <FiClock size={14} />
                            <span>{session.time}</span>
                          </div>

                          {session.notes && (
                            <div className="mt-2 p-2 rounded-lg bg-(--bg-muted)">
                              <p className="text-xs text-(--text-secondary) mb-1">
                                {t("studentModals.supportTracker.notes")}
                              </p>
                              <p className="text-sm">{session.notes}</p>
                            </div>
                          )}

                          {session.instructor && (
                            <p className="text-xs text-(--text-muted) mt-2">
                              {t("studentModals.supportTracker.with")}{" "}
                              {session.instructor.name}
                            </p>
                          )}
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}
              </div>

              {/* ===== FOOTER ===== */}
              <div className="p-4 border-t border-(--border-color) text-center text-xs text-(--text-muted)">
                {t("studentModals.supportTracker.footerText")}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <FiLoader className="animate-spin text-(--color-primary) mb-4" size={48} />
    <p className="text-(--text-secondary)">Loading...</p>
  </div>
);

const ErrorState = ({ error, onRetry }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <FiAlertCircle className="text-(--color-danger) mb-4" size={48} />
      <p className="text-(--text-secondary) mb-4 text-center">{error}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-(--color-primary) text-white hover:opacity-90 transition"
      >
        <FiRefreshCw size={16} />
        {t("studentModals.supportTracker.retry")}
      </button>
    </div>
  );
};

const EmptyState = ({ icon, text, subtext }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="text-(--text-muted) mb-4 opacity-50">{icon}</div>
    <p className="text-(--text-secondary) font-medium mb-2">{text}</p>
    {subtext && (
      <p className="text-(--text-muted) text-sm text-center">{subtext}</p>
    )}
  </div>
);

export default StudentSupportTrackerModal;
