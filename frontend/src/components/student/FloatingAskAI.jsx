import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AiTutorSelectModal from "./modal/AiTutorSelectModal";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const FloatingAskAI = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* FLOATING BUTTON */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        aria-label="Open AI tutor"
        className="group fixed bottom-8 right-5 sm:right-8 z-49 w-16 aspect-square md:w-auto md:aspect-auto md:px-6 md:py-4 rounded-full md:rounded-2xl bg-linear-to-r from-(--color-primary) to-(--color-secondary) text-white shadow-lg ring-1 ring-(--border-color) overflow-hidden"
      >
        <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
        <span className="absolute -inset-3 rounded-full bg-(--color-primary)/25 blur-2xl opacity-60" />
        <span className="relative flex items-center gap-2 font-semibold tracking-wide">
          <span className="hidden md:inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[11px] uppercase tracking-wider">
            AI
          </span>
          <span className="hidden md:inline-block">Ask Tutor</span>
          <span className="text-2xl sm:text-[16px] mx-auto md:hidden">
            <IoChatbubbleEllipsesOutline />
          </span>
        </span>
      </motion.button>

      {/* MODAL */}
      <AnimatePresence>
        {open && <AiTutorSelectModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default FloatingAskAI;
