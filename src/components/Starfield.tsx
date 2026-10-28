import { useEffect, useRef } from "react";

/* Fixed deep-space backdrop behind every section; drifts slightly with scroll. */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const stars = Array.from({ length: 420 }, () => ({
      x: Math.random(), y: Math.random(), z: Math.random(), tw: Math.random() * Math.PI * 2,
    }));
    let raf = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = (t: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth, h = window.innerHeight;
      if (c.width !== w * dpr) { c.width = w * dpr; c.height = h * dpr; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const sy = window.scrollY;
      for (const s of stars) {
        const y = (((s.y * h - sy * (0.02 + s.z * 0.06)) % h) + h) % h;
        const a = 0.15 + s.z * 0.55 + (reduced ? 0 : Math.sin(t / 1400 + s.tw) * 0.12);
        ctx.fillStyle = s.z > 0.93 ? `rgba(255,226,190,${a})` : `rgba(220,228,255,${a})`;
        const r = 0.35 + s.z * 0.9;
        ctx.beginPath();
        ctx.arc(s.x * w, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} aria-hidden="true" style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: -1, pointerEvents: "none" }} />;
}
