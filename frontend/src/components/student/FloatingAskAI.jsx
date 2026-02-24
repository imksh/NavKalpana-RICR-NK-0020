import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AiTutorSelectModal from "./modal/AiTutorSelectModal";

const FloatingAskAI = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* FLOATING BUTTON */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-5 sm:right-8 z-49 bg-(--color-primary) text-white w-16 aspect-square md:w-auto md:aspect-auto md:px-6 md:py-4 rounded-full shadow-lg"
      >
        <span className="hidden md:inline-block">Ask AI </span>{" "}
        <span className="text-2xl sm:text-[16px]"> 💬</span>
      </motion.button>

      {/* MODAL */}
      <AnimatePresence>
        {open && <AiTutorSelectModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default FloatingAskAI;
