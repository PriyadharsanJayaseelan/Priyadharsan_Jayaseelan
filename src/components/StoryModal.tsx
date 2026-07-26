import { useState, useEffect, useCallback, useRef } from "react";
import { openEmailPicker } from "./EmailPicker";

type Side = "left" | "right";

interface Bubble {
  side: Side;
  text: string;
  timestamp?: string;
  delay: number; // ms after previous bubble finishes appearing
}

const BUBBLES: Bubble[] = [
  { side: "left",  text: "Tamil Nadu, India.",              timestamp: "2005",  delay: 400  },
  { side: "left",  text: "Grew up curious about everything. Committed to none of it.", delay: 700 },
  { side: "right", text: "Kent, Ohio.",                     timestamp: "2023",  delay: 900  },
  { side: "right", text: "Moved at 18. One carry-on. Zero contacts. One goal.", delay: 700 },
  { side: "left",  text: "Landed my first federal project before sophomore year. AI systems — the kind that can't afford to fail.", delay: 1000 },
  { side: "right", text: "Started leading people almost by accident.",           delay: 800  },
  { side: "right", text: "250+ now. Turns out builders make good leaders.",      delay: 600  },
  { side: "left",  text: "Still a CS student by transcript.",                    delay: 900  },
  { side: "left",  text: "But the real degree has been shipping things under pressure.", delay: 600 },
  { side: "right", text: "Looking for the next problem worth solving.",          delay: 900  },
  { side: "right", text: "Maybe that's with you. 👋",                           delay: 500  },
];

export function openStoryModal() {
  window.dispatchEvent(new CustomEvent("open-story-modal"));
}

function TypingDots() {
  return (
    <div
      className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm"
      style={{ background: "rgba(255,255,255,0.10)", width: 56 }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block rounded-full"
          style={{
            width: 6,
            height: 6,
            background: "rgba(255,255,255,0.45)",
            animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function StoryModal() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState<number>(-1); // index of last revealed bubble
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startAnimation = () => {
    setShown(-1);
    setTyping(false);
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
    if (timerRef.current) clearTimeout(timerRef.current);
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

  // Drive bubble reveal sequence
  useEffect(() => {
    if (!open) return;
    const next = shown + 1;
    if (next >= BUBBLES.length) return;

    const bubble = BUBBLES[next];
    // Show typing indicator for a bit, then reveal bubble
    const typingDuration = Math.min(800 + bubble.text.length * 18, 2200);

    timerRef.current = setTimeout(() => {
      setTyping(true);
      timerRef.current = setTimeout(() => {
        setTyping(false);
        setShown(next);
      }, typingDuration);
    }, bubble.delay);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [open, shown]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [shown, typing]);

  if (!open) return null;

  const nextBubble = shown + 1 < BUBBLES.length ? BUBBLES[shown + 1] : null;
  const typingOnRight = typing && nextBubble?.side === "right";
  const done = shown === BUBBLES.length - 1 && !typing;

  return (
    <>
      <style>{`
        @keyframes typing-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.45; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes bubble-in-left {
          from { opacity: 0; transform: translateX(-10px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes bubble-in-right {
          from { opacity: 0; transform: translateX(10px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes reply-fade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center px-4 sm:px-6 pb-4 sm:pb-0">
        {/* Backdrop */}
        <div
          onClick={close}
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: "rgba(0,10,22,0.85)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            opacity: visible ? 1 : 0,
          }}
        />

        {/* Panel */}
        <div
          className="relative w-full max-w-md rounded-3xl flex flex-col transition-all duration-300 overflow-hidden"
          style={{
            background: "hsl(201,80%,8%)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 32px 100px rgba(0,0,0,0.65)",
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1) translateY(0)" : "scale(0.96) translateY(16px)",
            maxHeight: "88vh",
          }}
        >
          {/* Chat header */}
          <div
            className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}
          >
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
              style={{ background: "linear-gradient(135deg, hsl(201,80%,30%), hsl(240,60%,40%))", color: "#fff" }}
            >
              PJ
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white leading-none mb-0.5">Priyadharsan</p>
              <p className="text-xs" style={{ color: "#4ade80" }}>
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                  style={{ background: "#4ade80", boxShadow: "0 0 6px #4ade80" }}
                />
                Active now
              </p>
            </div>
            <button
              onClick={close}
              aria-label="Close"
              className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Messages area */}
          <div
            className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-2"
            style={{ scrollbarWidth: "none" }}
          >
            {BUBBLES.slice(0, shown + 1).map((bubble, i) => {
              const isLeft = bubble.side === "left";
              return (
                <div key={i} className={`flex flex-col gap-0.5 ${isLeft ? "items-start" : "items-end"}`}>
                  {bubble.timestamp && (
                    <p
                      className="text-xs px-2 mb-1"
                      style={{ color: "hsl(240,4%,42%)", alignSelf: "center" }}
                    >
                      {bubble.timestamp}
                    </p>
                  )}
                  <div
                    className="max-w-[78%] px-4 py-2.5 text-sm leading-relaxed"
                    style={{
                      background: isLeft
                        ? "rgba(255,255,255,0.10)"
                        : "linear-gradient(135deg, hsl(201,70%,28%), hsl(220,60%,32%))",
                      color: "#fff",
                      borderRadius: isLeft
                        ? "18px 18px 18px 4px"
                        : "18px 18px 4px 18px",
                      animation: `${isLeft ? "bubble-in-left" : "bubble-in-right"} 0.3s ease both`,
                    }}
                  >
                    {bubble.text}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {typing && (
              <div className={`flex ${typingOnRight ? "justify-end" : "justify-start"}`}>
                <div style={{ animation: "bubble-in-left 0.2s ease both" }}>
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Reply bar — appears when done */}
          {done && (
            <div
              className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.02)",
                animation: "reply-fade 0.5s ease both",
              }}
            >
              <button
                onClick={() => { close(); setTimeout(openEmailPicker, 320); }}
                className="flex-1 text-left text-sm px-4 py-2.5 rounded-full cursor-pointer transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "hsl(240,4%,50%)",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)";
                  (e.currentTarget as HTMLElement).style.color = "hsl(240,4%,70%)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.10)";
                  (e.currentTarget as HTMLElement).style.color = "hsl(240,4%,50%)";
                }}
              >
                Reply...
              </button>
              <button
                onClick={() => { close(); setTimeout(openEmailPicker, 320); }}
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-110"
                style={{
                  background: "linear-gradient(135deg, hsl(201,70%,32%), hsl(220,60%,36%))",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8h10M9 4l5 4-5 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
