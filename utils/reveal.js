import { useEffect, useRef } from "react";

/* Smooth scroll-in reveal; pairs with .career-fade / .career-in in index.css */
export const useReveal = (count) => {
  const refs = useRef([]);
  useEffect(() => {
    refs.current.slice(0, count).forEach((el) => {
      if (!el) return;
      const onMount = requestAnimationFrame(() => el.classList.add("career-in"));
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("career-in");
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.12 }
      );
      observer.observe(el);
      return () => {
        cancelAnimationFrame(onMount);
        observer.disconnect();
      };
    });
  }, [count]);

  return (i) => (el) => {
    refs.current[i] = el;
  };
};
