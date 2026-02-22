import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiBookOpen, FiLoader } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CloseButton from "../../CloseButton";
import useUiStore from "../../../store/useUiStore";
import toast from "react-hot-toast";
import api from "../../../config/api";

const _MotionRef = motion;
const MAX_DOUBT_LENGTH = 500;

const AskDoubtModal = ({ isOpen, onClose, selectedInstructor }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    instructor: selectedInstructor?.name || "",
    doubt: "",
    instructorId: selectedInstructor?._id || "",
    courseId: selectedInstructor?.courseId || "",
  });

  const { setIsModal } = useUiStore();

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
        subject: "",
        instructor: "",
        doubt: "",
        instructorId: "",
        courseId: "",
      });
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "doubt" && value.length > MAX_DOUBT_LENGTH) return;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.subject || !form.doubt) {
      toast.error(t("studentModals.askDoubt.requiredFields"));
      return;
    }
    try {
      setLoading(true);
      await api.post("/student/doubts", form);
      toast.success(t("studentModals.askDoubt.success"));
      onClose();
    } catch (error) {
      console.log("Error in submitting doubt:", error);
      toast.error(t("studentModals.askDoubt.error"));
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return form.subject.trim() && form.doubt.trim();
  };

  const getCharacterCount = () => {
    return `${form.doubt.length}/${MAX_DOUBT_LENGTH}`;
  };

  const getCharacterColor = () => {
    const ratio = form.doubt.length / MAX_DOUBT_LENGTH;
    if (ratio >= 0.9) return "text-red-500";
    if (ratio >= 0.7) return "text-yellow-500";
    return "text-(--text-muted)";
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
            transition={{ duration: 0.3 }}
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
                         w-full max-w-md rounded-3xl 
                         h-[75vh] flex flex-col relative"
            >
              {/* ===== HEADER ===== */}
              <div className="p-6 border-b border-(--border-color) relative">
                <div className="absolute top-6 right-6">
                  <CloseButton onClose={onClose} />
                </div>

                <h2 className="text-xl font-semibold text-center">
                  {t("studentModals.askDoubt.title")}
                </h2>

                {selectedInstructor && (
                  <p className="text-sm text-(--text-secondary) text-center mt-1">
                    {t("studentModals.askDoubt.sendingTo")}{" "}
                    {selectedInstructor?.name}
                  </p>
                )}
              </div>

              {/* ===== BODY ===== */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {/* Subject */}
                <div>
                  <label className="text-sm text-(--text-secondary)">
                    {t("studentModals.askDoubt.subjectLabel")}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex items-center gap-3 border border-(--border-color) bg-(--bg-main) p-3 rounded-xl mt-1 focus-within:border-(--color-primary) transition-colors">
                    <FiBookOpen className="text-(--text-muted)" />
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      disabled={loading}
                      className="flex-1 outline-none bg-transparent"
                      placeholder={t(
                        "studentModals.askDoubt.subjectPlaceholder",
                      )}
                    />
                  </div>
                </div>

                {/* Doubt Message */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-(--text-secondary)">
                      {t("studentModals.askDoubt.doubtLabel")}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <span className={`text-xs ${getCharacterColor()}`}>
                      {getCharacterCount()}
                    </span>
                  </div>
                  <textarea
                    name="doubt"
                    rows="6"
                    value={form.doubt}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full mt-1 p-3 rounded-xl border border-(--border-color) bg-(--bg-main) resize-none focus:border-(--color-primary) transition-colors"
                    placeholder={t("studentModals.askDoubt.doubtPlaceholder")}
                  />
                </div>
              </div>

              {/* ===== FOOTER ===== */}
              <div className="p-6 border-t border-(--border-color)">
                <motion.button
                  whileHover={{ scale: loading || !isFormValid() ? 1 : 1.02 }}
                  whileTap={{ scale: loading || !isFormValid() ? 1 : 0.95 }}
                  onClick={handleSubmit}
                  disabled={loading || !isFormValid()}
                  className="w-full py-3 rounded-xl bg-(--color-accent) text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-(--color-accent)/20"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FiLoader className="animate-spin" size={18} />
                      {t("studentModals.askDoubt.submittingButton")}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <FiMessageCircle />
                      {t("studentModals.askDoubt.submitButton")}
                    </span>
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

export default AskDoubtModal;
