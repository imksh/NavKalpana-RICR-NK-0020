import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ChatModal from "./ChatModal";
import { aiTutors } from "../../../assets/data/tutor";
import { IoClose } from "react-icons/io5";
import CloseButton from "../../CloseButton";
import useUiStore from "../../../store/useUiStore";

const AiTutorSelectModal = ({ onClose }) => {
  const [selectedTutor, setSelectedTutor] = useState(null);
  const { setIsModal } = useUiStore();

  useEffect(() => {
    setIsModal(true);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      setIsModal(false);
    };
  }, []);

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
                   rounded-3xl px-4 py-8 md:p-8 w-[90%] max-w-3xl shadow-xl max-h-[90vh] overflow-auto hide-scrollbar"
      >
        <div className="flex items-center w-full justify-between mb-6">
          <h2 className="text-xl font-semibold ">Choose Your AI Tutor</h2>

          <CloseButton onClose={onClose} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {aiTutors.map((ai) => (
            <div
              key={ai._id}
              onClick={() => setSelectedTutor(ai)}
              className="p-4 rounded-2xl border border-(--border-color) cursor-pointer hover:bg-(--bg-muted) transition-all"
            >
              <div className="flex items-center gap-4">
                <img
                  src={ai.avatar}
                  alt={ai.name}
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{ai.name}</h3>
                  <p className="text-sm text-(--text-secondary)">{ai.role}</p>
                </div>
              </div>
            </div>
          ))}
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
