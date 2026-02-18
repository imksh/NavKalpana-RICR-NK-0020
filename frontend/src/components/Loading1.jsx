import React from "react";

import loader from "../assets/animations/loading1.json";
import Lottie from "lottie-react";

const Loading1 = () => {
  return (
    <div
      className={`flex h-full w-full bg-gradient justify-center items-center`}
    >
      <Lottie animationData={loader} loop className="w-20" />
    </div>
  );
};

export default Loading1;
