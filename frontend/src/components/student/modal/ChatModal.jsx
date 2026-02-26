import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import CloseButton from "../../CloseButton";
import useUiStore from "../../../store/useUiStore";
import api from "../../../config/api";
import { toast } from "react-hot-toast";
import { FiSend, FiLoader } from "react-icons/fi";

const _MotionRef = motion;

const ChatModal = ({ tutor, onClose, isOpen }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const { setIsModal } = useUiStore();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setIsModal(true);
    document.body.style.overflow = "hidden";

    // Set welcome message when tutor loads
    setMessages([
      {
        sender: "ai",
        text: `Hi there! 👋 I'm ${tutor.title}. I'm here to help you with ${tutor.description.toLowerCase()}. What would you like to know?`,
      },
    ]);

    return () => {
      document.body.style.overflow = "auto";
      setIsModal(false);
    };
  }, [tutor, setIsModal]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message to UI
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    try {
      // Call AI API
      const response = await api.post("/ai/chat", {
        modelName: tutor.name,
        message: userMessage,
        conversationId: conversationId,
        strictRoleScope: true,
      });

      // Store conversation ID for future messages
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
      // Remove the user message if API call failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* BACKDROP */}
      <div onClick={onClose} className="fixed inset-0 bg-black/30 z-100" />

      {/* SLIDE PANEL */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween" }}
        className="fixed right-0 top-0 h-full w-full sm:w-105 
                   bg-(--card-bg) border-l border-(--border-color) 
                   z-101 flex flex-col"
      >
        {/* HEADER */}
        <div className="p-4 border-b border-(--border-color) flex items-center gap-3">
          <img
            src={tutor.avatar}
            alt={tutor.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold">{tutor.title}</h3>
            <p className="text-xs text-(--text-secondary)">{tutor.role}</p>
          </div>

          <div className="ml-auto">
            <CloseButton onClose={onClose} />
          </div>
        </div>

        {/* CHAT BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                msg.sender === "user"
                  ? "ml-auto bg-(--color-primary) text-white"
                  : "bg-(--bg-muted)"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-(--border-color) flex gap-2">
          <input
            type="text"
            placeholder={t("studentModals.chat.inputPlaceholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-(--border-color) bg-(--bg-surface)"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-(--color-primary) text-white rounded-xl"
          >
            {t("studentModals.chat.sendButton")}
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default ChatModal;
