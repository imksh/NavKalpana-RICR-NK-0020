import React from "react";
import useUiStore from "../store/useUiStore";
import { FiGlobe } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ChangeLanguage = () => {
  const { openLang, setOpenLang, lang, setLang, closeAll } = useUiStore();

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
  ];

  return (
    <div className="relative ">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpenLang(!openLang);
        }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-(--bg-muted) transition"
      >
        <FiGlobe className="text-white" />
        <span className="text-sm font-medium">
          {languages.find((l) => l.code === lang)?.label}
        </span>
      </button>

      <AnimatePresence>
        {openLang && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-36 bg-(--card-bg) border border-(--border-color) rounded-xl shadow-lg overflow-hidden z-50"
            onMouseLeave={() => setOpenLang(false)}
          >
            {languages.map((item) => (
              <button
                key={item.code}
                onClick={() => {
                  setLang(item.code);
                  setOpenLang(false);
                  closeAll();
                }}
                className={`w-full text-left px-4 py-2 hover:bg-(--bg-muted) transition ${
                  lang === item.code
                    ? "text-(--color-primary) font-medium"
                    : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChangeLanguage;