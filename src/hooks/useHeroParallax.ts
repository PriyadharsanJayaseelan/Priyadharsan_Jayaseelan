import { useEffect, useRef } from "react";

/**
 * Scroll-driven hero exit. Progress runs 0 -> 1 as the user scrolls
 * through the hero. Direct style writes inside requestAnimationFrame,
 * so no React re-renders. Desktop only; respects reduced motion.
 */
export function useHeroParallax() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lineLeftRef = useRef<HTMLSpanElement>(null);
  const lineRightRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!isDesktop || reducedMotion) return;

    let ticking = false;

    const apply = () => {
      ticking = false;
      const range = window.innerHeight * 0.85;
      const p = Math.min(Math.max(window.scrollY / range, 0), 1);
      // ease-out so the drift starts gently
      const e = 1 - Math.pow(1 - p, 2);

      if (videoRef.current) {
        videoRef.current.style.transform = `scale(${1 + e * 0.12})`;
      }
      if (lineLeftRef.current) {
        lineLeftRef.current.style.transform = `translateX(${-e * 90}px)`;
        lineLeftRef.current.style.opacity = `${1 - e * 1.1}`;
      }
      if (lineRightRef.current) {
        lineRightRef.current.style.transform = `translateX(${e * 90}px)`;
        lineRightRef.current.style.opacity = `${1 - e * 1.1}`;
      }
      if (badgeRef.current) {
        badgeRef.current.style.opacity = `${1 - e * 1.4}`;
      }
      if (bodyRef.current) {
        bodyRef.current.style.transform = `translateY(${e * 40}px)`;
        bodyRef.current.style.opacity = `${1 - e * 1.2}`;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { videoRef, lineLeftRef, lineRightRef, badgeRef, bodyRef };
}
