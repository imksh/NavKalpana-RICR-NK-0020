import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCalendar, FiClock, FiUser, FiLoader } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CloseButton from "../../CloseButton";
import useUiStore from "../../../store/useUiStore";
import toast from "react-hot-toast";
import api from "../../../config/api";

const _MotionRef = motion;

const BookSessionModal = ({
  isOpen,
  onClose,
  selectedInstructor,
  selectedTopic,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const { lang, setIsModal } = useUiStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    topic: selectedTopic?.title
      ? `Doubt regarding ${selectedTopic?.title[lang]} course`
      : "",
    date: "",
    time: "",
    instructor: selectedInstructor?.name || "",
    notes: "",
    instructorId: selectedInstructor?._id || "",
    courseId: selectedTopic?._id || "",
  });

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
      setForm({
        topic: "",
        date: "",
        time: "",
        instructor: "",
        notes: "",
        instructorId: "",
        courseId: "",
      });
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.topic || !form.date || !form.time) {
      toast.error(t("studentModals.bookSession.requiredFields"));
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(form.date + "T" + form.time);
    const now = new Date();
    if (selectedDate < now) {
      toast.error(t("studentModals.bookSession.pastDateError"));
      return;
    }

    try {
      setLoading(true);
      await api.post("/student/book-session", form);
      toast.success(t("studentModals.bookSession.success"));
      if (onSubmit) await onSubmit();
      onClose();
    } catch (error) {
      console.log("Error in booking session:", error);
      toast.error(t("studentModals.bookSession.error"));
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return form.topic && form.date && form.time;
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (isOpen) {
      setForm((prev) => ({
        ...prev,
        topic: selectedTopic?.title
          ? `Doubt regarding ${selectedTopic?.title[lang]} course`
          : "",
        instructor: selectedInstructor?.name || "",
        instructorId: selectedInstructor?._id || "",
        courseId: selectedTopic?._id || "",
      }));
    }
  }, [isOpen, selectedTopic, selectedInstructor]);

  return (
    <AnimatePresence>
      {/* Overlay */}
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 w-full h-full"
          />

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
               w-full max-w-md rounded-3xl 
               h-[85vh] flex flex-col relative"
            >
              {/* ===== HEADER (FIXED) ===== */}
              <div className="p-6 border-b border-(--border-color) relative">
                <div className="absolute top-6 right-6">
                  <CloseButton onClose={onClose} />
                </div>

                <h2 className="text-xl font-semibold text-(--text-primary) text-center">
                  {t("studentModals.bookSession.title")}
                </h2>
              </div>

              {/* ===== SCROLLABLE BODY ===== */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {/* Topic */}
                <div>
                  <label className="text-sm text-(--text-secondary)">
                    {t("studentModals.bookSession.topicLabel")}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="topic"
                    value={form.topic}
                    disabled={!!selectedTopic || loading}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 rounded-xl border border-(--border-color) bg-(--bg-main) disabled:opacity-60"
                    placeholder={t(
                      "studentModals.bookSession.topicPlaceholder",
                    )}
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="text-sm text-(--text-secondary)">
                    {t("studentModals.bookSession.dateLabel")}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex items-center gap-3 border border-(--border-color) bg-(--bg-main) p-3 rounded-xl mt-1 focus-within:border-(--color-primary) transition-colors">
                    <FiCalendar className="text-(--text-muted)" />
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      disabled={loading}
                      min={getTodayDate()}
                      className="flex-1 outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="text-sm text-(--text-secondary)">
                    {t("studentModals.bookSession.timeLabel")}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex items-center gap-3 border border-(--border-color) bg-(--bg-main) p-3 rounded-xl mt-1 focus-within:border-(--color-primary) transition-colors">
                    <FiClock className="text-(--text-muted)" />
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      disabled={loading}
                      className="flex-1 outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Instructor */}
                <div>
                  <label className="text-sm text-(--text-secondary)">
                    {t("studentModals.bookSession.instructorLabel")}
                  </label>
                  <div className="flex items-center gap-3 border border-(--border-color) bg-(--bg-main) p-3 rounded-xl mt-1">
                    <FiUser className="text-(--text-muted)" />
                    <input
                      type="text"
                      name="instructor"
                      value={form.instructor}
                      disabled={!!selectedInstructor || loading}
                      onChange={handleChange}
                      className="flex-1 outline-none bg-transparent disabled:opacity-60"
                      placeholder={t(
                        "studentModals.bookSession.instructorPlaceholder",
                      )}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-sm text-(--text-secondary)">
                    {t("studentModals.bookSession.notesLabel")}
                  </label>
                  <textarea
                    name="notes"
                    rows="3"
                    value={form.notes}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full mt-1 p-3 rounded-xl border border-(--border-color) bg-(--bg-main) resize-none"
                    placeholder={t(
                      "studentModals.bookSession.notesPlaceholder",
                    )}
                  />
                </div>
              </div>

              {/* ===== FOOTER (FIXED) ===== */}
              <div className="p-6 border-t border-(--border-color)">
                <motion.button
                  whileHover={{ scale: loading || !isFormValid() ? 1 : 1.02 }}
                  whileTap={{ scale: loading || !isFormValid() ? 1 : 0.95 }}
                  onClick={handleSubmit}
                  disabled={loading || !isFormValid()}
                  className="w-full py-3 rounded-xl bg-(--color-primary) text-white hover:opacity-90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-lg shadow-(--color-primary)/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" size={18} />
                      <span>
                        {t("studentModals.bookSession.bookingButton")}
                      </span>
                    </>
                  ) : (
                    t("studentModals.bookSession.confirmButton")
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookSessionModal;
