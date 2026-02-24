import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ChatModal from "./ChatModal";
import { IoClose } from "react-icons/io5";
import CloseButton from "../../CloseButton";
import useUiStore from "../../../store/useUiStore";
import api from "../../../config/api";
import { toast } from "react-hot-toast";

const _MotionRef = motion;

const AiTutorSelectModal = ({ onClose }) => {
  const { t } = useTranslation();
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [aiModels, setAiModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setIsModal,isModal } = useUiStore();
  useEffect(() => {
    setIsModal(true);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      setIsModal(false);
    };
  }, [isModal]);

  useEffect(() => {
    const fetchAiModels = async () => {
      try {
        setLoading(true);
        const res = await api.get("/ai/models");
        setAiModels(res.data);
      } catch (error) {
        console.error("Failed to load AI models:", error);
        toast.error(
          t("studentModals.aiTutorSelect.loadError") ||
            "Failed to load AI models",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAiModels();
  }, [t]);

  return (
    <>
      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-98 overflow-auto"
      />

      {/* CENTER MODAL */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="fixed z-99 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   bg-(--card-bg) border border-(--border-color) 
                   rounded-3xl px-4 py-8 md:p-8 w-[90%] max-w-5xl shadow-2xl max-h-[90vh] overflow-auto hide-scrollbar"
      >
        {/* Header */}
        <div className="flex items-center w-full justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-(--color-primary) to-blue-500 bg-clip-text text-transparent">
              {t("studentModals.aiTutorSelect.title") ||
                "Choose Your AI Teacher"}
            </h2>
            <p className="text-sm text-(--text-secondary) mt-2">
              Select an AI teacher specialized in your learning needs
            </p>
          </div>
          <CloseButton onClose={onClose} />
        </div>

        {/* Teachers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-(--color-primary) border-r-(--color-primary)"></div>
                <p className="text-sm text-(--text-secondary)">
                  Loading teachers...
                </p>
              </div>
            </div>
          ) : aiModels.length > 0 ? (
            aiModels.map((model) => (
              <motion.div
                key={model._id}
                onClick={() => setSelectedTutor(model)}
                whileHover={{ scale: 1.05, y: -6 }}
                whileTap={{ scale: 0.95 }}
                className="group relative cursor-pointer"
              >
                {/* Glow Effect Background */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"
                  style={{ backgroundColor: model.color }}
                />

                {/* Card */}
                <div
                  className="relative p-6 md:p-7 rounded-2xl border border-(--border-color) bg-gradient-to-br from-(--card-bg) to-(--bg-muted) 
                              hover:border-(--color-primary) transition-all duration-300 overflow-hidden"
                >
                  {/* Top Accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${model.color}, transparent)`,
                    }}
                  />

                  {/* Content */}
                  <div className="flex flex-col gap-5">
                    {/* Avatar Section */}
                    <div className="flex justify-center">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="relative"
                      >
                        {/* Avatar Glow */}
                        <div
                          className="absolute inset-0 rounded-full blur-xl opacity-40"
                          style={{ backgroundColor: model.color }}
                        />

                        {/* Avatar Image */}
                        <img
                          src={model.avatar}
                          alt={model.title}
                          className="relative w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-(--color-primary) shadow-lg"
                        />

                        {/* Icon Badge */}
                        <div className="absolute -bottom-1 -right-1 bg-(--card-bg) border-2 border-(--color-primary) rounded-full p-2 text-2xl shadow-md">
                          {model.icon}
                        </div>
                      </motion.div>
                    </div>

                    {/* Text Info */}
                    <div className="text-center">
                      <h3 className="font-bold text-lg md:text-xl text-(--text-primary)">
                        {model.title}
                      </h3>
                      <p className="text-xs md:text-sm font-medium text-(--color-primary) mt-1 uppercase tracking-wide">
                        {model.role}
                      </p>
                      <p className="text-xs md:text-sm text-(--text-secondary) mt-3 leading-relaxed line-clamp-2">
                        {model.description}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-center pt-2">
                      {model.isActive ? (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30"
                        >
                          ✓ Available Now
                        </motion.span>
                      ) : (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-500/30">
                          ○ Coming Soon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute top-4 right-4 text-2xl"
                  >
                    →
                  </motion.div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-4xl mb-4">🤖</div>
              <p className="text-base font-medium text-(--text-primary)">
                No AI teachers available
              </p>
              <p className="text-sm text-(--text-secondary) mt-2">
                Please try again later
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* CHAT MODAL */}
      {selectedTutor && (
        <ChatModal
          tutor={selectedTutor}
          onClose={() => {
            setSelectedTutor(null);
          }}
        />
      )}
    </>
  );
};

export default AiTutorSelectModal;
