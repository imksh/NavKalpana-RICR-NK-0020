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

const AskDoubtModal = ({ isOpen, onClose, selectedInstructor, onSubmit }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("instructor"); // "instructor" or "ai"
  const [aiModels, setAiModels] = useState([]);
  const [selectedAiModel, setSelectedAiModel] = useState(null);
  const [loadingModels, setLoadingModels] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    instructor: selectedInstructor?.name || "",
    doubt: "",
    instructorId: selectedInstructor?._id || "",
    courseId: selectedInstructor?.courseId || "",
  });

  const { setIsModal } = useUiStore();

  // Fetch AI models when modal opens and AI tab is selected
  useEffect(() => {
    if (isOpen && activeTab === "ai" && aiModels.length === 0) {
      fetchAiModels();
    }
  }, [isOpen, activeTab]);

  const fetchAiModels = async () => {
    try {
      setLoadingModels(true);
      const res = await api.get("/ai/models");
      setAiModels(res.data);
      if (res.data.length > 0) {
        setSelectedAiModel(res.data[0].name);
      }
    } catch (error) {
      console.error("Error fetching AI models:", error);
      toast.error("Failed to load AI models");
    } finally {
      setLoadingModels(false);
    }
  };

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

    if (activeTab === "instructor") {
      // Submit to instructor
      try {
        setLoading(true);
        await api.post("/student/doubts", form);
        toast.success(t("studentModals.askDoubt.success"));
        if (onSubmit) await onSubmit();
        onClose();
      } catch (error) {
        console.log("Error in submitting doubt:", error);
        toast.error(t("studentModals.askDoubt.error"));
      } finally {
        setLoading(false);
      }
    } else {
      // Submit to AI
      await submitToAi();
    }
  };

  const submitToAi = async () => {
    if (!selectedAiModel) {
      toast.error("Please select an AI model");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/ai/chat", {
        modelName: selectedAiModel,
        message: form.doubt,
        courseId: form.courseId || null,
      });

      toast.success("Got response from AI!");
      console.log("AI Response:", response.data);
    } catch (error) {
      console.error("Error submitting to AI:", error);
      toast.error("Failed to get AI response");
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
              {/* ===== HEADER WITH TABS ===== */}
              <div className="p-6 border-b border-(--border-color) relative">
                <div className="absolute top-6 right-6">
                  <CloseButton onClose={onClose} />
                </div>

                <h2 className="text-xl font-semibold text-center mb-4">
                  {t("studentModals.askDoubt.title")}
                </h2>

                {/* TAB BUTTONS */}
                <div className="flex gap-2 bg-(--bg-muted) p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab("instructor")}
                    className={`flex-1 py-2 rounded-md transition-all text-sm font-medium ${
                      activeTab === "instructor"
                        ? "bg-(--color-primary) text-white"
                        : "text-(--text-secondary) hover:text-(--text-primary)"
                    }`}
                  >
                    Ask Instructor
                  </button>
                  <button
                    onClick={() => setActiveTab("ai")}
                    className={`flex-1 py-2 rounded-md transition-all text-sm font-medium ${
                      activeTab === "ai"
                        ? "bg-(--color-primary) text-white"
                        : "text-(--text-secondary) hover:text-(--text-primary)"
                    }`}
                  >
                    Ask AI
                  </button>
                </div>
              </div>

              {/* ===== BODY ===== */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {/* AI MODEL SELECTION (only for AI tab) */}
                {activeTab === "ai" && (
                  <div>
                    <label className="text-sm text-(--text-secondary) block mb-2">
                      Choose AI Model
                    </label>
                    {loadingModels ? (
                      <div className="p-3 bg-(--bg-muted) rounded-xl text-center text-sm">
                        Loading models...
                      </div>
                    ) : aiModels.length > 0 ? (
                      <select
                        value={selectedAiModel || ""}
                        onChange={(e) => setSelectedAiModel(e.target.value)}
                        disabled={loading}
                        className="w-full p-3 rounded-xl border border-(--border-color) bg-(--bg-main) text-(--text-primary)"
                      >
                        {aiModels.map((model) => (
                          <option key={model._id} value={model.name}>
                            {model.icon} {model.title}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-3 bg-(--bg-muted) rounded-xl text-center text-sm text-(--text-secondary)">
                        No AI models available
                      </div>
                    )}
                  </div>
                )}

                {/* INSTRUCTOR INFO (only for instructor tab) */}
                {activeTab === "instructor" && selectedInstructor && (
                  <p className="text-sm text-(--text-secondary) text-center pb-2">
                    {t("studentModals.askDoubt.sendingTo")}{" "}
                    {selectedInstructor?.name}
                  </p>
                )}

                {/* Subject */}
                <div>
                  <label className="text-sm text-(--text-secondary)">
                    {activeTab === "instructor"
                      ? t("studentModals.askDoubt.subjectLabel")
                      : "Topic"}
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
                      {activeTab === "instructor"
                        ? t("studentModals.askDoubt.doubtLabel")
                        : "Your Question"}
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
                      {activeTab === "instructor"
                        ? t("studentModals.askDoubt.submittingButton")
                        : "Getting AI Response..."}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <FiMessageCircle />
                      {activeTab === "instructor"
                        ? t("studentModals.askDoubt.submitButton")
                        : "Ask AI"}
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
