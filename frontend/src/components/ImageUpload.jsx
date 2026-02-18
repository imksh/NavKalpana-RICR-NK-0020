import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "motion/react";
import { FaCamera } from "react-icons/fa";
import useUiStore from "../store/useUiStore";
import Loading1 from "./Loading1";

const ImageUpload = ({ id, left }) => {
  const { user } = useAuthStore();
  const { previews, handleImageRemove, handleImageUpload, isUploading } =
    useUiStore();
  if (!user) return null;
  if (user.role !== "admin") return null;
  return (
    <div
      className={`z-999 flex flex-col justify-center items-center absolute bottom-5 ${left ? "left-5" : "right-5"} gap-4`}
    >
      <div className="flex gap-4">
        <motion.label
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          htmlFor={id}
          className="z-10 bg-(--primary) text-white w-12 h-12 rounded-full flex justify-center items-center  cursor-pointer"
        >
          <FaCamera size={24} />
        </motion.label>
        {previews?.[id] && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-red-500 rounded-full flex justify-center items-center text-white cursor-pointer"
            onClick={() => handleImageRemove(id)}
          >
            X
          </motion.div>
        )}
      </div>
      {previews?.[id] && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-blue-500 rounded-2xl hover:bg-blue-700 text-white cursor-pointer px-6 py-2 disabled:bg-gray-400 min-w-32 min-h-10"
          onClick={() => handleImageUpload(id)}
          disabled={isUploading === id}
        >
          {isUploading === id ? <Loading1 className="w-20" /> : "Update"}
        </motion.button>
      )}
    </div>
  );
};

export default ImageUpload;
