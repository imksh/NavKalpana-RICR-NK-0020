import React from "react";
import Lottie from "lottie-react";
import infinity from "../assets/animations/infinity.json";
import { motion } from "motion/react";

const InfinityFooter = ({ hide, name }) => {
  return (
    <div className=" flex flex-col items-center justify-center mt-20 gap-4 pb-8">
      <motion.a
        drag
        dragConstraints={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{
          scale: 0.9,
        }}
        className="cursor-pointer"
        href="https://imksh3.netlify.app/"
        target="_blank"
      >
        <Lottie
          animationData={infinity}
          loop={true}
          style={{ width: 150, height: 150 }}
        />
      </motion.a>
      {!hide && (
        <a
          href="https://imksh3.netlify.app/"
          style={{ fontSize: 14 }}
          className="text-neutral-400"
        >
          {name ? <p>{name}</p> : <p>Crafted with ❤️ by Karan</p>}
        </a>
      )}
    </div>
  );
};

export default InfinityFooter;
