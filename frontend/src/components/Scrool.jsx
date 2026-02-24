import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export const Scroll = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositionsRef = useRef(new Map());

  useEffect(() => {
    const targetPosition =
      navigationType === "POP"
        ? (scrollPositionsRef.current.get(location.key) ?? 0)
        : 0;

    requestAnimationFrame(() => {
      window.scrollTo({ top: targetPosition, left: 0, behavior: "auto" });
    });

    return () => {
      scrollPositionsRef.current.set(location.key, window.scrollY);
    };
  }, [location.key, navigationType]);

  return null;
};
