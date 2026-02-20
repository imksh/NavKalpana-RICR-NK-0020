import { useEffect } from "react";
import Lenis from "lenis";
import useUiStore from "../store/useUiStore";

const useLenis = () => {
  const { isModal } = useUiStore();
  useEffect(() => {
    if (isModal) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smooth: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isModal]);
};

export default useLenis;
