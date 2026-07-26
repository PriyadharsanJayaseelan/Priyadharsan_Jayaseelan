import { useState, useEffect, useCallback, useRef } from "react";
import { openEmailPicker } from "./EmailPicker";

export function openStoryModal() {
  window.dispatchEvent(new CustomEvent("open-story-modal"));
}

const MILESTONES = [
  { level: "01", date: "Aug 2023", icon: "🌍", title: "Arrived in the US",       sub: "KSU Global Scholarship Recipient",          color: "#38bdf8" },
  { level: "02", date: "Jan 2024", icon: "🏅", title: "Alpha Lambda Delta",       sub: "Academic Honor Society · 3.5+ GPA",           color: "#a78bfa" },
  { level: "03", date: "Aug 2024", icon: "💵", title: "First Paycheck",            sub: "Food Service Worker · KSU Dining",             color: "#4ade80" },
  { level: "04", date: "Jan 2025", icon: "📋", title: "Student Manager",           sub: "KSU Dining · 3 service units",                 color: "#fb923c" },
  { level: "05", date: "Jan 2025", icon: "🥽", title: "VR Research Assistant",     sub: "KSU Aeronautics & Engineering Lab",             color: "#f472b6" },
  { level: "06", date: "May 2025", icon: "🤝", title: "HR & Hiring Manager",       sub: "Large-scale university hiring ops",             color: "#34d399" },
  { level: "07", date: "Sep 2025", icon: "🎯", title: "Leads 250+ People",         sub: "Operational Lead · 3 dining units",             color: "#fbbf24" },
  { level: "08", date: "Jan 2026", icon: "💻", title: "Software Dev Intern",       sub: "StreetStashed · Next.js / React / TS",          color: "#60a5fa" },
  { level: "09", date: "May 2026", icon: "🛡️", title: "Federal AI Engineer",       sub: "FAST / Pivotal ITS · DoD · GSA · VA",          color: "#f87171" },
];

const NODE_H     = 88;   // px per row in the SVG
const START_DELAY = 550;  // ms before first unlock
const INTERVAL    = 820;  // ms between unlocks

// Pre-computed ECG SVG path: vertical line with QRS spikes at each node
// SVG viewBox "0 0 60 H" where H = MILESTONES.length * NODE_H + 40
// Each node center: cy = 20 + i * NODE_H
const buildPath = () => {
  const nodes = MILESTONES.map((_, i) => 20 + i * NODE_H);
  const total  = nodes[nodes.length - 1] + 20;
  let d = `M 30,0 `;
  nodes.forEach((ny, i) => {
    // flat section before spike
    d += `L 30,${ny - 14} `;
    // QRS: Q (slight left), R (right peak), S (left overshoot), return
    d += `L 26,${ny - 4} L 50,${ny + 3} L 22,${ny + 10} L 30,${ny + 16} `;
    if (i < nodes.length - 1) d += `L 30,${nodes[i + 1] - 14} `;
  });
  d += `L 30,${total}`;
  return { d, total, nodes };
};

const { d: ECG_PATH, total: SVG_H } = buildPath();

export default function StoryModal() {
  const [open, setOpen]             = useState(false);
  const [visible, setVisible]       = useState(false);
  const [unlocked, setUnlocked]     = useState(-1);   // index of last unlocked node
  const [pathLen, setPathLen]       = useState<number | null>(null);
  const [animKey, setAnimKey]       = useState(0);    // force re-mount SVG on reopen
  const pathRef  = useRef<SVGPathElement>(null);
  const timers   = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const startAnimation = () => {
    setUnlocked(-1);
    setAnimKey(k => k + 1);
    clearTimers();
    MILESTONES.forEach((_, i) => {
      const t = setTimeout(() => setUnlocked(i), START_DELAY + i * INTERVAL);
      timers.current.push(t);
    });
  };

  useEffect(() => {
    const show = () => {
      setOpen(true);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setVisible(true);
        startAnimation();
      }));
    };
    window.addEventListener("open-story-modal", show);
    return () => window.removeEventListener("open-story-modal", show);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    clearTimers();
    setTimeout(() => setOpen(false), 300);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, close]);

  // measure path length after SVG mounts
  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength());
  }, [animKey, open]);

  if (!open) return null;

  const totalDuration = START_DELAY + MILESTONES.length * INTERVAL + 400;
  const done = unlocked === MILESTONES.length - 1;

  return (
    <>
      <style>{`
        @keyframes ecg-draw {
          from { stroke-dashoffset: var(--ecg-len, 9999); }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes node-ping {
          0%   { transform: scale(1); opacity: 0.9; }
          70%  { transform: scale(2.6); opacity: 0; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes card-in {
          from { opacity: 0; transform: translateX(14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes lvl-flash {
          0%   { opacity: 0; transform: scale(0.85); }
          50%  { opacity: 1; transform: scale(1.06); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes scanline {
          from { top: 0; }
          to   { top: 100%; }
        }
        @keyframes modal-rise {
          from { opacity: 0; transform: scale(0.96) translateY(14px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes done-pulse {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1; }
        }
        .ecg-path-animated {
          stroke-dashoffset: var(--ecg-len, 9999);
          animation: ecg-draw var(--ecg-dur, 8s) linear forwards;
          animation-delay: 0ms;
        }
      `}</style>

      <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center px-3 sm:px-6 pb-3 sm:pb-0">
        {/* Backdrop */}
        <div
          onClick={close}
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: "rgba(0,8,20,0.88)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            opacity: visible ? 1 : 0,
          }}
        />

        {/* Panel */}
        <div
          className="relative w-full max-w-lg sm:max-w-xl flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl"
          style={{
            background: "hsl(210,40%,6%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 40px 120px rgba(0,0,0,0.7)",
            maxHeight: "90vh",
            animation: visible ? "modal-rise 0.35s ease both" : "none",
          }}
        >
          {/* Scanline overlay */}
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none",
              background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
            }}
          />

          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "#4ade80", boxShadow: "0 0 8px #4ade80", animation: "done-pulse 2s ease-in-out infinite" }}
              />
              <span
                className="text-xs tracking-[0.2em] uppercase"
                style={{ fontFamily: "monospace", color: "hsl(240,4%,55%)" }}
              >
                Career Log · PJ
              </span>
            </div>
            <button
              onClick={close}
              aria-label="Close"
              className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            <div className="flex" style={{ minHeight: SVG_H + 40 }}>

              {/* ECG column */}
              <div
                className="flex-shrink-0 relative"
                style={{ width: 56, paddingTop: 20 - NODE_H / 2 + NODE_H / 2 }}
              >
                <svg
                  key={animKey}
                  viewBox={`0 0 60 ${SVG_H + 40}`}
                  width={56}
                  height={SVG_H + 40}
                  style={{ display: "block", overflow: "visible" }}
                >
                  {/* Glow filter */}
                  <defs>
                    <filter id="ecg-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>

                  {/* Ghost path (dim baseline) */}
                  <path d={ECG_PATH} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />

                  {/* Animated ECG line */}
                  {pathLen && (
                    <path
                      ref={pathRef}
                      d={ECG_PATH}
                      fill="none"
                      stroke="url(#ecg-gradient)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#ecg-glow)"
                      className="ecg-path-animated"
                      style={{
                        "--ecg-len": pathLen,
                        "--ecg-dur": `${totalDuration}ms`,
                      } as React.CSSProperties}
                    />
                  )}
                  {/* Measure path (invisible, rendered first) */}
                  {!pathLen && (
                    <path ref={pathRef} d={ECG_PATH} fill="none" stroke="none" strokeWidth="1.5" />
                  )}

                  {/* Gradient for ECG line */}
                  <defs>
                    <linearGradient id="ecg-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#38bdf8" />
                      <stop offset="50%"  stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#f87171" />
                    </linearGradient>
                  </defs>

                  {/* Node dots */}
                  {MILESTONES.map((m, i) => {
                    const cy = 20 + i * NODE_H;
                    const isOn = i <= unlocked;
                    return (
                      <g key={i}>
                        {/* Ping ring */}
                        {isOn && (
                          <circle
                            cx={30} cy={cy} r={6}
                            fill="none"
                            stroke={m.color}
                            strokeWidth="1.5"
                            style={{
                              transformOrigin: `30px ${cy}px`,
                              animation: `node-ping 0.6s ease-out both`,
                              opacity: 0,
                            }}
                          />
                        )}
                        {/* Node circle */}
                        <circle
                          cx={30} cy={cy} r={5}
                          fill={isOn ? m.color : "hsl(210,40%,10%)"}
                          stroke={isOn ? m.color : "rgba(255,255,255,0.12)"}
                          strokeWidth="1.5"
                          style={{
                            filter: isOn ? `drop-shadow(0 0 5px ${m.color})` : "none",
                            transition: "fill 0.2s, stroke 0.2s, filter 0.2s",
                          }}
                        />
                        {/* Check mark when unlocked */}
                        {isOn && (
                          <path
                            d={`M ${30 - 2.5},${cy} L ${30 - 0.5},${cy + 2} L ${30 + 3},${cy - 2}`}
                            fill="none"
                            stroke="hsl(210,40%,6%)"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Milestone cards column */}
              <div className="flex-1 flex flex-col py-1" style={{ paddingTop: 4 }}>
                {MILESTONES.map((m, i) => {
                  const isOn = i <= unlocked;
                  return (
                    <div
                      key={i}
                      className="flex items-center"
                      style={{ height: NODE_H, paddingRight: 16, paddingLeft: 4 }}
                    >
                      {isOn ? (
                        <div
                          className="w-full"
                          style={{ animation: "card-in 0.35s ease both" }}
                        >
                          {/* Level badge row */}
                          <div className="flex items-center gap-2 mb-0.5">
                            <span
                              className="text-[10px] tracking-[0.15em] px-1.5 py-0.5 rounded"
                              style={{
                                fontFamily: "monospace",
                                background: `${m.color}18`,
                                color: m.color,
                                border: `1px solid ${m.color}40`,
                                animation: "lvl-flash 0.4s ease both",
                              }}
                            >
                              LVL {m.level}
                            </span>
                            <span
                              className="text-[10px] tracking-widest uppercase"
                              style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.28)" }}
                            >
                              UNLOCKED ✓
                            </span>
                            <span
                              className="text-[10px] ml-auto"
                              style={{ fontFamily: "monospace", color: "hsl(240,4%,40%)" }}
                            >
                              {m.date}
                            </span>
                          </div>

                          {/* Title */}
                          <div className="flex items-center gap-2">
                            <span className="text-base">{m.icon}</span>
                            <span
                              className="text-sm font-medium leading-tight"
                              style={{ color: "#fff" }}
                            >
                              {m.title}
                            </span>
                          </div>

                          {/* Sub */}
                          <p
                            className="text-xs mt-0.5 leading-relaxed"
                            style={{ color: "hsl(240,4%,52%)", paddingLeft: "1.75rem" }}
                          >
                            {m.sub}
                          </p>
                        </div>
                      ) : (
                        /* Locked state */
                        <div className="flex items-center gap-2 opacity-20">
                          <span
                            className="text-[10px] tracking-[0.15em] px-1.5 py-0.5 rounded"
                            style={{
                              fontFamily: "monospace",
                              color: "rgba(255,255,255,0.4)",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            LVL {m.level}
                          </span>
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
                            ░░░░░░░░░░░
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex-shrink-0 px-5 py-4 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}
          >
            <span
              className="text-[11px] tracking-[0.12em] uppercase"
              style={{
                fontFamily: "monospace",
                color: done ? "#4ade80" : "hsl(240,4%,40%)",
                transition: "color 0.5s",
                animation: done ? "done-pulse 2s ease-in-out infinite" : "none",
              }}
            >
              {done ? "▶ CAREER IN PROGRESS" : "▶ LOADING..."}
            </span>
            {done && (
              <button
                onClick={() => { close(); setTimeout(openEmailPicker, 320); }}
                className="text-xs rounded-full px-4 py-2 cursor-pointer transition-all duration-200 hover:scale-[1.04]"
                style={{
                  fontFamily: "inherit",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  animation: "card-in 0.4s ease both",
                }}
              >
                Get In Touch →
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
