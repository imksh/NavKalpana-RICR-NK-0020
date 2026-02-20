import React from "react";
import { IoClose } from "react-icons/io5";
import { motion } from "motion/react";

const CloseButton = ({ onClose }) => {
  return (
    <motion.button
      whileHover={{ rotate: 90, scale: 1.1 }}
      transition={{ duration: 0.2 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClose}
      className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer hover:shadow hover:text-red-500"
    >
      <IoClose size={20} />
    </motion.button>
  );
};

export default CloseButton;
