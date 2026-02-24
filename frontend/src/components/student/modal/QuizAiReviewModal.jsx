import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import CloseButton from "../../CloseButton";
import useUiStore from "../../../store/useUiStore";
import api from "../../../config/api";
import { toast } from "react-hot-toast";
import {
  FiSend,
  FiLoader,
  FiZap,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";

const MotionDiv = motion.div;

const QuizAiReviewModal = ({ quizId, courseId, onClose, isOpen }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const messagesEndRef = useRef(null);

  const { setIsModal } = useUiStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch quiz review on modal open
  useEffect(() => {
    if (!isOpen) return;

    const fetchReview = async () => {
      try {
        setReviewLoading(true);

        // Fetch quiz result for review
        const response = await api.post("/ai/quiz-review", {
          quizId,
          courseId,
        });

        setReviewData(response.data);

        // Set initial AI message with review
        setMessages([
          {
            sender: "ai",
            text:
              response.data.aiReview ||
              "I've reviewed your quiz. Ask me anything about your performance!",
            isReview: true,
            review: response.data,
          },
        ]);

        setIsModal(true);
        document.body.style.overflow = "hidden";
      } catch (error) {
        console.error("Error fetching review:", error);
        toast.error("Failed to load AI review");
        // Set fallback message
        setMessages([
          {
            sender: "ai",
            text: "I'm ready to help review your quiz. Ask me anything!",
          },
        ]);
      } finally {
        setReviewLoading(false);
      }
    };

    fetchReview();

    return () => {
      document.body.style.overflow = "auto";
      setIsModal(false);
    };
  }, [isOpen, quizId, courseId, setIsModal]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message to UI
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    try {
      // Call AI API with quiz context
      const response = await api.post("/ai/chat", {
        modelName: "DoubtSolver",
        message: userMessage,
        conversationId: conversationId,
        context: {
          type: "quiz_review",
          quizId,
          reviewData,
        },
      });

      // Store conversation ID
      if (!conversationId) {
        setConversationId(response.data.conversationId);
      }

      // Add AI response to UI
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: response.data.response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get response from AI");
      // Remove user message if failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50  ${isOpen ? "" : "pointer-events-none"}`}
    >
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 0.5 : 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <MotionDiv
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{
          scale: isOpen ? 1 : 0.9,
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : 20,
        }}
        className="absolute inset-0 flex items-center justify-center p-4 bg-black/40"
        onClick={onClose}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="bg-(--card-bg) border border-(--border-color) rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-(--border-color) p-5 md:p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-(--color-primary)/10 rounded-lg">
                <HiOutlineSparkles
                  size={20}
                  className="text-(--color-primary)"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {t("quizPage.aiReview") || "Quiz AI Review"}
                </h2>
                <p className="text-xs text-(--text-secondary)">
                  {t("quizPage.aiReviewSubtitle") ||
                    "Get personalized feedback on your performance"}
                </p>
              </div>
            </div>
            <CloseButton onClose={onClose} />
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4">
            {reviewLoading ? (
              <div className="flex items-center justify-center py-8">
                <FiLoader
                  className="animate-spin text-(--color-primary)"
                  size={24}
                />
                <span className="ml-3 text-(--text-secondary)">
                  {t("quizPage.analyzingQuiz") || "Analyzing your quiz..."}
                </span>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg text-sm rounded-2xl px-4 py-3 ${
                        msg.sender === "user"
                          ? "bg-(--color-primary) text-white rounded-br-none"
                          : "bg-(--bg-muted) text-(--text-primary) rounded-bl-none"
                      }`}
                    >
                      {msg.isReview && msg.review ? (
                        <div className="space-y-3">
                          {/* Score Summary */}
                          <div className="bg-(--card-bg) rounded-lg p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <FiZap
                                size={16}
                                className="text-(--color-primary)"
                              />
                              <span className="font-semibold">
                                {t("quizPage.yourScore") || "Your Score"}
                              </span>
                              <span className="ml-auto text-lg font-bold">
                                {msg.review.score || 0}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-(--border-color) rounded-full overflow-hidden">
                              <div
                                className="h-2 bg-(--color-primary) rounded-full"
                                style={{
                                  width: `${Math.min(msg.review.score || 0, 100)}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Strengths */}
                          {msg.review.strengths &&
                            msg.review.strengths.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <FiCheckCircle
                                    size={14}
                                    className="text-(--color-success)"
                                  />
                                  <span className="text-xs font-semibold text-(--color-success)">
                                    {t("quizPage.strengths") || "Strengths"}
                                  </span>
                                </div>
                                <ul className="text-xs text-(--text-secondary) space-y-1 ml-6 list-disc">
                                  {msg.review.strengths.map((s, i) => (
                                    <li key={i}>{s}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          {/* Areas for Improvement */}
                          {msg.review.improvements &&
                            msg.review.improvements.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <FiAlertCircle
                                    size={14}
                                    className="text-(--color-warning)"
                                  />
                                  <span className="text-xs font-semibold text-(--color-warning)">
                                    {t("quizPage.improvements") ||
                                      "Areas to Improve"}
                                  </span>
                                </div>
                                <ul className="text-xs text-(--text-secondary) space-y-1 ml-6 list-disc">
                                  {msg.review.improvements.map((imp, i) => (
                                    <li key={i}>{imp}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          {/* Suggestions */}
                          {msg.review.suggestions &&
                            msg.review.suggestions.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <HiOutlineSparkles
                                    size={14}
                                    className="text-(--color-primary)"
                                  />
                                  <span className="text-xs font-semibold text-(--color-primary)">
                                    {t("quizPage.suggestions") ||
                                      "Recommendations"}
                                  </span>
                                </div>
                                <ul className="text-xs text-(--text-secondary) space-y-1 ml-6 list-disc">
                                  {msg.review.suggestions.map((sugg, i) => (
                                    <li key={i}>{sugg}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          <p className="text-xs text-(--text-secondary) italic">
                            {msg.text}
                          </p>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-(--border-color) p-4 md:p-5 bg-(--bg-muted)">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder={
                  t("quizPage.askAboutQuiz") || "Ask about your performance..."
                }
                disabled={loading || reviewLoading}
                className="flex-1 bg-(--card-bg) border border-(--border-color) rounded-2xl px-4 py-2 text-sm focus:outline-none focus:border-(--color-primary) disabled:opacity-50 placeholder-(--text-muted)"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim() || reviewLoading}
                className="w-10 flex items-center justify-center aspect-square bg-(--color-primary) text-white rounded-2xl cursor-pointer hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <FiLoader className="animate-spin" size={20} />
                ) : (
                  <FiSend size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </MotionDiv>
    </MotionDiv>
  );
};

export default QuizAiReviewModal;
