import React from "react";

import infinity from "../assets/animations/infinity.json";
import Lottie from "lottie-react";

const Loading = ({ size = "w-60 h-60" }) => {
  return (
    <div
      className={`flex h-full w-full absolute top-0 left-0 bg-(--bg-main) justify-center items-center`}
    >
      <Lottie animationData={infinity} loop className={size} />
    </div>
  );
};

export default Loading;
