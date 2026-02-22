import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CloseButton from "../../CloseButton";
import useUiStore from "../../../store/useUiStore";

const _MotionRef = motion;

const ChatModal = ({ tutor, onClose, isOpen }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: tutor.welcomeMessage
        ? tutor.welcomeMessage("Karan")
        : t("studentModals.chat.defaultWelcome"),
    },
  ]);

  const { setIsModal } = useUiStore();

  useEffect(() => {
    setIsModal(true);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      setIsModal(false);
    };
  }, []);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: input },
      { sender: "ai", text: t("studentModals.chat.demoResponse") },
    ]);

    setInput("");
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
        className="fixed right-0 top-0 h-full w-full sm:w-[420px] 
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
            <h3 className="font-semibold">{tutor.name}</h3>
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
