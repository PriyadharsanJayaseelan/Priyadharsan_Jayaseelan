import { useEffect, useRef } from "react";

/* Fixed deep-space backdrop behind every section. Drawn once (and on resize), never per frame. */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const stars = Array.from({ length: 420 }, () => ({ x: Math.random(), y: Math.random(), z: Math.random() }));
    let lastW = 0;
    const paint = () => {
      const w = window.innerWidth, h = window.screen.height || window.innerHeight;
      // phones fire resize as the URL bar slides; only repaint when the width changes
      if (w === lastW) return;
      lastW = w;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = w * dpr;
      c.height = h * dpr;
      c.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const s of stars) {
        ctx.fillStyle = s.z > 0.93 ? `rgba(255,226,190,${0.2 + s.z * 0.6})` : `rgba(220,228,255,${0.15 + s.z * 0.55})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, 0.35 + s.z * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    paint();
    window.addEventListener("resize", paint);
    return () => window.removeEventListener("resize", paint);
  }, []);
  return <canvas ref={ref} aria-hidden="true" style={{ position: "fixed", top: 0, left: 0, width: "100vw", zIndex: -1, pointerEvents: "none" }} />;
}
