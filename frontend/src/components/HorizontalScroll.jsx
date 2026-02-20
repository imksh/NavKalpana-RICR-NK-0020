import { useEffect, useRef } from "react";

const HorizontalScroll = ({ children }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  return (
    <div
      ref={scrollRef}
      className="overflow-x-auto whitespace-nowrap"
    >
      {children}
    </div>
  );
};

export default HorizontalScroll;