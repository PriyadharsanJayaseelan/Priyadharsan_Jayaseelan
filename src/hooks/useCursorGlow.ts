import { useEffect } from "react";

export function useCursorGlow() {
  useEffect(() => {
    const el = document.createElement("div");
    el.id = "cursor-glow";
    Object.assign(el.style, {
      position: "fixed",
      width: "420px",
      height: "420px",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "9999",
      transform: "translate(-50%, -50%)",
      background:
        "radial-gradient(circle, rgba(148,163,184,0.06) 0%, transparent 70%)",
      transition: "opacity 0.3s ease",
      opacity: "0",
    });
    document.body.appendChild(el);

    const move = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      el.style.opacity = "1";
    };
    const hide = () => (el.style.opacity = "0");

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseleave", hide);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", hide);
      el.remove();
    };
  }, []);
}
