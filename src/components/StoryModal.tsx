import { useState, useEffect, useCallback, useRef } from "react";

const LINES = [
  "I grew up in Tamil Nadu, India — curious about everything, settled on none of it.",
  "At 18, I moved to the United States with one carry-on and one goal: build things that matter.",
  "I found that goal at the intersection of software, security, and systems that serve millions.",
  "By day, I'm a QA engineer helping secure federal AI platforms — code that can't afford to fail.",
  "By evening, I lead a 250+ person organization on campus, because I believe builders also need to serve.",
  "I'm a CS student by transcript. But the real curriculum has been shipping, breaking, and fixing things under pressure.",
  "I'm looking for the next problem worth solving. Maybe that's with you.",
];

const CHAR_DELAY = 28;
const LINE_GAP = 420;

export function openStoryModal() {
  window.dispatchEvent(new CustomEvent("open-story-modal"));
}

export default function StoryModal() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [linesDone, setLinesDone] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "gap" | "done">("typing");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Reset animation state when modal opens
  const startAnimation = () => {
    setLinesDone([]);
    setCurrentLine("");
    setLineIndex(0);
    setCharIndex(0);
    setPhase("typing");
  };

  useEffect(() => {
    const show = () => {
      setOpen(true);
      startAnimation();
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    };
    window.addEventListener("open-story-modal", show);
    return () => window.removeEventListener("open-story-modal", show);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(() => setOpen(false), 300);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  // Typewriter animation
  useEffect(() => {
    if (!open || phase === "done") return;

    if (phase === "typing") {
      const target = LINES[lineIndex];
      if (charIndex < target.length) {
        const t = setTimeout(() => {
          setCurrentLine(target.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        }, CHAR_DELAY);
        return () => clearTimeout(t);
      } else {
        // Line complete — wait before starting next
        const t = setTimeout(() => {
          setLinesDone((prev) => [...prev, target]);
          setCurrentLine("");
          const next = lineIndex + 1;
          if (next >= LINES.length) {
            setPhase("done");
          } else {
            setLineIndex(next);
            setCharIndex(0);
            setPhase("gap");
          }
        }, LINE_GAP);
        return () => clearTimeout(t);
      }
    }

    if (phase === "gap") {
      const t = setTimeout(() => setPhase("typing"), 160);
      return () => clearTimeout(t);
    }
  }, [open, phase, lineIndex, charIndex]);

  // Auto-scroll to bottom as text appears
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [linesDone, currentLine]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center px-4 sm:px-6 pb-4 sm:pb-0">
      {/* Backdrop */}
      <div
        onClick={close}
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: "rgba(0,10,22,0.82)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-xl rounded-3xl transition-all duration-300 flex flex-col"
        style={{
          background: "hsl(201,80%,9%)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 32px 100px rgba(0,0,0,0.6)",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.96) translateY(16px)",
          maxHeight: "88vh",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-8 pt-8 pb-6 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <p
              className="text-xs tracking-widest uppercase mb-1"
              style={{ color: "hsl(240,4%,48%)" }}
            >
              My Story
            </p>
            <h3
              className="text-3xl font-normal text-white"
              style={{ fontFamily: "'Instrument Serif', serif", letterSpacing: "-0.02em" }}
            >
              How I got{" "}
              <em className="not-italic" style={{ color: "hsl(240,4%,66%)" }}>
                here.
              </em>
            </h3>
          </div>

          <button
            onClick={close}
            aria-label="Close"
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 1l10 10M11 1L1 11"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Story body — scrollable */}
        <div
          className="px-8 py-7 overflow-y-auto flex-1"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex flex-col gap-5">
            {linesDone.map((line, i) => (
              <p
                key={i}
                className="text-base leading-relaxed"
                style={{
                  color: i === linesDone.length - 1 && phase !== "done"
                    ? "hsl(240,4%,78%)"
                    : "hsl(240,4%,70%)",
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  transition: "color 0.4s",
                }}
              >
                {line}
              </p>
            ))}

            {/* Currently typing line */}
            {currentLine && (
              <p
                className="text-base leading-relaxed"
                style={{
                  color: "#fff",
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                }}
              >
                {currentLine}
                <span
                  style={{
                    display: "inline-block",
                    width: "2px",
                    height: "1em",
                    background: "hsl(240,4%,66%)",
                    marginLeft: "2px",
                    verticalAlign: "middle",
                    animation: "pulse-dot 1s ease-in-out infinite",
                  }}
                />
              </p>
            )}

            {/* Cursor while gap between lines */}
            {phase === "gap" && (
              <p style={{ height: "1.5rem" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "2px",
                    height: "1em",
                    background: "hsl(240,4%,55%)",
                    verticalAlign: "middle",
                    animation: "pulse-dot 1s ease-in-out infinite",
                  }}
                />
              </p>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Footer — shown only when done */}
        {phase === "done" && (
          <div
            className="px-8 pb-8 pt-5 flex-shrink-0 flex flex-wrap gap-3 items-center justify-between"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              animation: "fadeRise 0.5s ease both",
            }}
          >
            <p className="text-xs" style={{ color: "hsl(240,4%,48%)" }}>
              Tamil Nadu → Kent, Ohio → wherever the work is.
            </p>
            <div className="flex gap-2">
              <a
                href="https://github.com/PriyadharsanJayaseelan"
                target="_blank"
                rel="noreferrer"
                className="no-underline rounded-full px-4 py-2 text-xs transition-all duration-200"
                style={{
                  color: "hsl(240,4%,62%)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.28)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "hsl(240,4%,62%)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                GitHub ↗
              </a>
              <a
                href="https://www.linkedin.com/in/priyadharsan-jayaseelan/"
                target="_blank"
                rel="noreferrer"
                className="no-underline rounded-full px-4 py-2 text-xs transition-all duration-200"
                style={{
                  color: "hsl(240,4%,62%)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.28)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "hsl(240,4%,62%)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
