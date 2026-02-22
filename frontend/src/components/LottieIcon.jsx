import { memo, useRef } from "react";
import Lottie from "lottie-react";
import { useInView } from "framer-motion";

const LottieIcon = memo(({ animation, className, loop = true }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "" });

  return (
    <div ref={ref}>
      {isInView && (
        <Lottie
          animationData={animation}
          loop={loop}
          autoplay
          renderer="svg"
          className={className}
        />
      )}
    </div>
  );
});

export default LottieIcon;
