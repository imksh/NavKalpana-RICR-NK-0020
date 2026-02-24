import React from "react";

import loading from "../assets/animations/loadingWave.json";
import Lottie from "lottie-react";
import Loading from "./Loading";

const LoadingWave = ({ size = "w-60 h-60" }) => {
  return (
    <div
      className={`flex h-full w-full absolute top-0 left-0 bg-(--bg-main) justify-center items-center`}
    >
      <Lottie animationData={loading} loop className={size} />
    </div>
  );
};

export default LoadingWave;
