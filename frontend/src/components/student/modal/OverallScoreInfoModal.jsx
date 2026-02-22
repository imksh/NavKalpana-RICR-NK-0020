import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import CloseButton from "../../CloseButton";
import { useEffect } from "react";
import useUiStore from "../../../store/useUiStore";

const _MotionRef = motion;

const OverallScoreInfoModal = ({
  isOpen,
  onClose,
  avgAssignmentMarks = 0,
  avgQuizScore = 0,
  attendancePercent = 0,
  courseCompletionPercent = 0,
  overallScore = 0,
}) => {
  const { t } = useTranslation();
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
    };
  }, [isOpen]);
  return (
    <AnimatePresence>
      {/* Overlay */}
      {isOpen && (
        <>
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
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-(--card-bg) border border-(--border-color) w-full max-w-md p-6 rounded-3xl relative"
            >
              {/* Close */}
              <button onClick={onClose} className="absolute top-4 right-4">
                <CloseButton onClose={onClose} />
              </button>

              <h2 className="text-xl font-semibold mb-6 text-center">
                {t("studentModals.scoreInfo.title")}
              </h2>

              {/* Breakdown */}
              <div className="space-y-4 text-sm">
                <ScoreRow
                  label={t("studentModals.scoreInfo.assignments")}
                  value={avgAssignmentMarks}
                  weight="0.4"
                />

                <ScoreRow
                  label={t("studentModals.scoreInfo.quizzes")}
                  value={avgQuizScore}
                  weight="0.4"
                />

                <ScoreRow
                  label={t("studentModals.scoreInfo.attendance")}
                  value={attendancePercent}
                  weight="0.1"
                />

                <ScoreRow
                  label={t("studentModals.scoreInfo.courseCompletion")}
                  value={courseCompletionPercent}
                  weight="0.1"
                />
              </div>

              {/* Final Score */}
              <div className="mt-6 border-t border-(--border-color) pt-4 text-center">
                <p className="text-(--text-secondary) text-sm">
                  {t("studentModals.scoreInfo.finalScore")}
                </p>
                <p className="text-3xl font-bold text-(--color-primary) mt-2">
                  {overallScore}%
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ScoreRow = ({ label, value, weight }) => {
  return (
    <div className="flex justify-between items-center bg-(--bg-muted) px-4 py-3 rounded-xl">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-xs text-(--text-secondary)">
          {value}% × {weight}
        </p>
      </div>
      <p className="font-semibold">{(value * weight).toFixed(1)}%</p>
    </div>
  );
};

export default OverallScoreInfoModal;
