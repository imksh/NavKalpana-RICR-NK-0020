import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const emojis = ["🙏🏻", "🚀", "🔥", "✨", "💡", "📚", "🎯", "🏆"];

const FloatingEmojis = () => {
  const [emoji, setEmoji] = useState(emojis[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const random = emojis[Math.floor(Math.random() * emojis.length)];
      setEmoji(random);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="flex items-center justify-center relative w-10 aspect-square mx-2">
      <AnimatePresence mode="wait">
        <motion.span
          key={emoji}
          drag
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute"
        >
          {emoji}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default FloatingEmojis;
