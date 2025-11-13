// frontend/src/components/layout/ScrollToTop.jsx
import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  // show/hide button on user scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // set initial state

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // auto-scroll to top when route changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Small timeout to ensure layout/render finished before smooth scroll if needed
    window.scrollTo({ top: 0, behavior: "smooth" });
    // If you want an instant jump instead, use: window.scrollTo(0, 0);
  }, [location.pathname]);

  const scrollToTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-transform hover:scale-110 z-50"
        >
          <FaArrowUp />
        </motion.button>
      )}
    </>
  );
};

export default ScrollToTop;
