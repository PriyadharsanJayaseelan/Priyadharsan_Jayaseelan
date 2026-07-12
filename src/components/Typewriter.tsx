import { useState, useEffect } from "react";

const roles = [
  "Software QA Engineer",
  "Federal Systems Builder",
  "CS Researcher",
  "ML Engineer",
];

export default function Typewriter() {
  const [displayed, setDisplayed] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "erasing">("typing");

  useEffect(() => {
    const current = roles[roleIndex];

    if (phase === "typing") {
      if (displayed.length < current.length) {
        const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("pausing"), 1800);
        return () => clearTimeout(t);
      }
    }

    if (phase === "pausing") {
      const t = setTimeout(() => setPhase("erasing"), 400);
      return () => clearTimeout(t);
    }

    if (phase === "erasing") {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
        return () => clearTimeout(t);
      } else {
        setRoleIndex((i) => (i + 1) % roles.length);
        setPhase("typing");
      }
    }
  }, [displayed, phase, roleIndex]);

  return (
    <span className="inline-flex items-center gap-1">
      <span>{displayed}</span>
      <span
        className="inline-block w-px h-5 align-middle"
        style={{
          background: "hsl(240,4%,66%)",
          animation: "pulse-dot 1s ease-in-out infinite",
        }}
      />
    </span>
  );
}
