import { useState, useEffect, useCallback, useRef } from "react";
import { openEmailPicker } from "./EmailPicker";

export function openStoryModal() {
  window.dispatchEvent(new CustomEvent("open-story-modal"));
}

/* ── Milestone data ─────────────────────────────────────────── */
const MILESTONES = [
  { level: "01", date: "Aug 2023", title: "Arrived in US",        sub: "KSU Global Scholarship",        color: "#38bdf8" },
  { level: "02", date: "Jan 2024", title: "Alpha Lambda Delta",   sub: "Academic Honor Society",         color: "#a78bfa" },
  { level: "03", date: "Aug 2024", title: "First Paycheck",       sub: "KSU Food Service Worker",        color: "#4ade80" },
  { level: "04", date: "Jan 2025", title: "Student Manager",      sub: "KSU Dining · 3 units",           color: "#fb923c" },
  { level: "05", date: "Jan 2025", title: "VR Research",          sub: "KSU Aeronautics Lab",            color: "#f472b6" },
  { level: "06", date: "May 2025", title: "HR Manager",           sub: "University Hiring Ops",          color: "#34d399" },
  { level: "07", date: "Sep 2025", title: "Leads 250+ People",    sub: "Operational Lead · 3 units",     color: "#fbbf24" },
  { level: "08", date: "Jan 2026", title: "Software Dev Intern",  sub: "StreetStashed · Next.js / TS",   color: "#60a5fa" },
  { level: "09", date: "May 2026", title: "Federal AI Engineer",  sub: "FAST / Pivotal ITS · DoD / VA",  color: "#f87171" },
];

/* ── Layout constants ───────────────────────────────────────── */
const CARD_W   = 158;
const CARD_GAP = 24;
const STEP     = CARD_W + CARD_GAP;   // 182
const PAD      = 40;
const ECG_H    = 112;                  // px height of ECG strip
const BASE_Y   = 82;                   // baseline y inside ECG strip
const N        = MILESTONES.length;
const TOTAL_W  = PAD * 2 + N * STEP;  // total scrollable width

/* ── Build horizontal ECG SVG path ─────────────────────────── */
// node i center x = PAD + i * STEP + CARD_W / 2
const nodeX = (i: number) => PAD + i * STEP + CARD_W / 2;

const buildEcgPath = () => {
  let d = `M 0,${BASE_Y} L ${nodeX(0) - 20},${BASE_Y} `;
  for (let i = 0; i < N; i++) {
    const cx = nodeX(i);
    // QRS complex: Q dip, R spike up, S dip below, return
    d += `L ${cx - 8},${BASE_Y + 6} `;   // Q
    d += `L ${cx},${BASE_Y - 60} `;      // R  (dramatic spike)
    d += `L ${cx + 6},${BASE_Y + 14} `; // S
    d += `L ${cx + 14},${BASE_Y} `;     // return
    if (i < N - 1) d += `L ${nodeX(i + 1) - 20},${BASE_Y} `;
  }
  d += `L ${TOTAL_W},${BASE_Y}`;
  return d;
};

const ECG_PATH = buildEcgPath();

/* ── Timing ─────────────────────────────────────────────────── */
const START_MS    = 700;
const INTERVAL_MS = 1300;
const TOTAL_DUR   = START_MS + N * INTERVAL_MS + 600;

/* ── Component ──────────────────────────────────────────────── */
export default function StoryModal() {
  const [open, setOpen]       = useState(false);
  const [visible, setVisible] = useState(false);
  const [unlocked, setUnlocked] = useState(-1);
  const [pathLen, setPathLen] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const pathRef  = useRef<SVGPathElement>(null);
  const timers   = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const startAnimation = () => {
    setUnlocked(-1);
    setAnimKey(k => k + 1);
    clearTimers();
    MILESTONES.forEach((_, i) => {
      const t = setTimeout(() => {
        setUnlocked(i);
        // auto-scroll to keep unlocking card in view
        if (scrollRef.current) {
          const target = PAD + i * STEP - 40;
          scrollRef.current.scrollTo({ left: target, behavior: "smooth" });
        }
      }, START_MS + i * INTERVAL_MS);
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

  useEffect(() => {
    if (pathRef.current) setPathLen(Math.ceil(pathRef.current.getTotalLength()));
  }, [animKey, open]);

  if (!open) return null;

  const done = unlocked === N - 1;

  return (
    <>
      <style>{`
        @keyframes ecg-draw {
          from { stroke-dashoffset: var(--pl, 9999); }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes ecg-sweep {
          0%   { transform: translateX(-80px); opacity: 1; }
          100% { transform: translateX(${TOTAL_W + 80}px); opacity: 1; }
        }
        @keyframes spike-glow {
          0%,100% { opacity: 0; }
          50%      { opacity: 1; }
        }
        @keyframes node-ping {
          0%   { r: 6; opacity: 0.9; }
          100% { r: 18; opacity: 0; }
        }
        @keyframes card-unlock {
          0%   { opacity:0; transform: translateY(10px) scale(0.96); }
          60%  { opacity:1; transform: translateY(-2px) scale(1.02); }
          100% { opacity:1; transform: translateY(0) scale(1); }
        }
        @keyframes lvl-badge {
          0%   { opacity:0; letter-spacing: 0.3em; }
          100% { opacity:1; letter-spacing: 0.12em; }
        }
        @keyframes pulse-green {
          0%,100% { opacity:0.7; box-shadow: 0 0 6px #4ade80; }
          50%      { opacity:1;   box-shadow: 0 0 14px #4ade80; }
        }
        @keyframes connector-grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .ecg-live-sweep {
          animation: ecg-sweep ${TOTAL_DUR * 1.5}ms linear infinite;
          animation-delay: ${TOTAL_DUR}ms;
        }
      `}</style>

      <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center px-0 sm:px-6 pb-0 sm:pb-0">
        {/* Backdrop */}
        <div
          onClick={close}
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: "rgba(0,8,20,0.90)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            opacity: visible ? 1 : 0,
          }}
        />

        {/* Panel */}
        <div
          className="relative w-full sm:max-w-4xl flex flex-col overflow-hidden sm:rounded-3xl rounded-t-3xl"
          style={{
            background: "hsl(212,50%,6%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 40px 120px rgba(0,0,0,0.75)",
            maxHeight: "88vh",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {/* Scanline texture */}
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none",
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 3px)",
            }}
          />

          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 flex-shrink-0 relative z-10"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: "#4ade80", animation: "pulse-green 2s ease-in-out infinite" }}
              />
              <span
                className="text-xs tracking-[0.18em] uppercase"
                style={{ fontFamily: "monospace", color: "hsl(240,4%,52%)" }}
              >
                Career Log · Live
              </span>
            </div>
            <div className="flex items-center gap-3">
              {done && (
                <span
                  className="text-[10px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full"
                  style={{
                    fontFamily: "monospace",
                    color: "#4ade80",
                    border: "1px solid rgba(74,222,128,0.3)",
                    background: "rgba(74,222,128,0.06)",
                    animation: "pulse-green 2.5s ease-in-out infinite",
                  }}
                >
                  In Progress
                </span>
              )}
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
          </div>

          {/* Scrollable content — horizontal */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto overflow-y-hidden relative z-10"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            <div style={{ width: TOTAL_W, minHeight: ECG_H + 180, position: "relative", paddingBottom: 32 }}>

              {/* ── ECG Strip ── */}
              <div
                style={{
                  height: ECG_H,
                  position: "relative",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  overflow: "hidden",
                }}
              >
                <svg
                  key={animKey}
                  viewBox={`0 0 ${TOTAL_W} ${ECG_H}`}
                  width={TOTAL_W}
                  height={ECG_H}
                  style={{ display: "block", position: "absolute", top: 0, left: 0 }}
                >
                  <defs>
                    <filter id="hb-glow">
                      <feGaussianBlur stdDeviation="2.5" result="b" />
                      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <linearGradient id="hb-grad" x1="0" y1="0" x2="1" y2="0">
                      {MILESTONES.map((m, i) => (
                        <stop key={i} offset={`${(i / (N - 1)) * 100}%`} stopColor={m.color} />
                      ))}
                    </linearGradient>
                    {/* Sweep gradient for live effect */}
                    <linearGradient id="sweep-grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%"   stopColor="transparent" />
                      <stop offset="40%"  stopColor="rgba(255,255,255,0.04)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
                    </linearGradient>
                  </defs>

                  {/* Ghost baseline */}
                  <line x1="0" y1={BASE_Y} x2={TOTAL_W} y2={BASE_Y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                  {/* Ghost ECG (dim) */}
                  <path d={ECG_PATH} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />

                  {/* Animated ECG line */}
                  {pathLen && (
                    <path
                      d={ECG_PATH}
                      fill="none"
                      stroke="url(#hb-grad)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#hb-glow)"
                      style={{
                        strokeDasharray: pathLen,
                        strokeDashoffset: pathLen,
                        animation: `ecg-draw ${TOTAL_DUR}ms linear forwards`,
                        "--pl": pathLen,
                      } as React.CSSProperties}
                    />
                  )}
                  {/* invisible path for measurement */}
                  {!pathLen && <path ref={pathRef} d={ECG_PATH} fill="none" stroke="none" strokeWidth="2" />}
                  {pathLen && <path ref={pathRef} d={ECG_PATH} fill="none" stroke="none" strokeWidth="2" />}

                  {/* Live sweep effect (plays after draw finishes) */}
                  {done && (
                    <rect
                      x={-80} y={0} width={80} height={ECG_H}
                      fill="url(#sweep-grad)"
                      className="ecg-live-sweep"
                    />
                  )}

                  {/* Node dots on ECG */}
                  {MILESTONES.map((m, i) => {
                    const cx = nodeX(i);
                    const isOn = i <= unlocked;
                    return (
                      <g key={i}>
                        {isOn && (
                          <circle cx={cx} cy={BASE_Y} r={6} fill="none" stroke={m.color} strokeWidth="1.5"
                            style={{ animation: "node-ping 0.55s ease-out both" }} />
                        )}
                        <circle
                          cx={cx} cy={BASE_Y} r={isOn ? 4 : 3}
                          fill={isOn ? m.color : "rgba(255,255,255,0.08)"}
                          stroke={isOn ? "none" : "rgba(255,255,255,0.15)"}
                          strokeWidth="1"
                          style={{
                            filter: isOn ? `drop-shadow(0 0 6px ${m.color})` : "none",
                            transition: "fill 0.2s, r 0.2s",
                          }}
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* ── Level cards row ── */}
              <div
                style={{
                  position: "absolute",
                  top: ECG_H + 16,
                  left: PAD,
                  display: "flex",
                  gap: CARD_GAP,
                  alignItems: "flex-start",
                }}
              >
                {MILESTONES.map((m, i) => {
                  const isOn = i <= unlocked;
                  const isNext = i === unlocked + 1;

                  return (
                    <div key={i} style={{ position: "relative", width: CARD_W }}>
                      {/* Connector line to next card */}
                      {i < N - 1 && (
                        <div
                          style={{
                            position: "absolute",
                            top: 22,
                            left: CARD_W,
                            width: CARD_GAP,
                            height: 1,
                            transformOrigin: "left center",
                            background: isOn ? MILESTONES[i].color : "rgba(255,255,255,0.08)",
                            opacity: isOn ? 0.5 : 1,
                            animation: isOn ? "connector-grow 0.3s ease both" : "none",
                            transition: "background 0.3s",
                          }}
                        />
                      )}

                      {/* Card */}
                      <div
                        style={{
                          width: CARD_W,
                          borderRadius: 14,
                          border: `1px solid ${isOn ? m.color + "40" : "rgba(255,255,255,0.07)"}`,
                          background: isOn
                            ? `linear-gradient(145deg, ${m.color}0d 0%, rgba(255,255,255,0.03) 100%)`
                            : "rgba(255,255,255,0.02)",
                          padding: "12px 14px",
                          transition: "border-color 0.3s, background 0.3s",
                          boxShadow: isOn ? `0 0 20px ${m.color}18` : "none",
                          animation: isOn ? "card-unlock 0.4s ease both" : "none",
                          minHeight: 120,
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {/* Shimmer on unlock */}
                        {isOn && (
                          <div
                            style={{
                              position: "absolute", inset: 0,
                              background: `linear-gradient(120deg, transparent 30%, ${m.color}15 50%, transparent 70%)`,
                              animation: "connector-grow 0.6s ease both",
                              pointerEvents: "none",
                            }}
                          />
                        )}

                        {/* Level badge */}
                        <div
                          className="flex items-center justify-between mb-2"
                          style={{ animation: isOn ? "lvl-badge 0.35s ease both" : "none" }}
                        >
                          <span
                            className="text-[10px] tracking-[0.12em]"
                            style={{
                              fontFamily: "monospace",
                              color: isOn ? m.color : "rgba(255,255,255,0.2)",
                              transition: "color 0.3s",
                            }}
                          >
                            LVL {m.level}
                          </span>
                          {isOn && (
                            <span style={{ color: m.color, fontSize: 10, fontFamily: "monospace" }}>✓</span>
                          )}
                          {isNext && !isOn && (
                            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, fontFamily: "monospace" }}>
                              ...
                            </span>
                          )}
                        </div>

                        {isOn ? (
                          <>
                            {/* Date */}
                            <p
                              className="text-[10px] mb-1"
                              style={{ fontFamily: "monospace", color: "hsl(240,4%,45%)" }}
                            >
                              {m.date}
                            </p>
                            {/* Title */}
                            <p
                              className="text-xs font-semibold leading-tight mb-1.5"
                              style={{ color: "#fff", letterSpacing: "-0.01em" }}
                            >
                              {m.title}
                            </p>
                            {/* Sub */}
                            <p
                              className="text-[10px] leading-relaxed"
                              style={{ color: "hsl(240,4%,50%)" }}
                            >
                              {m.sub}
                            </p>
                          </>
                        ) : (
                          /* Locked state */
                          <div className="mt-1">
                            <div
                              style={{
                                height: 6, borderRadius: 3, marginBottom: 8,
                                background: "rgba(255,255,255,0.05)", width: "70%",
                              }}
                            />
                            <div
                              style={{
                                height: 6, borderRadius: 3, marginBottom: 6,
                                background: "rgba(255,255,255,0.04)", width: "90%",
                              }}
                            />
                            <div
                              style={{
                                height: 6, borderRadius: 3,
                                background: "rgba(255,255,255,0.03)", width: "55%",
                              }}
                            />
                            <div
                              style={{
                                marginTop: 10,
                                fontFamily: "monospace",
                                fontSize: 10,
                                color: "rgba(255,255,255,0.08)",
                                letterSpacing: "0.05em",
                              }}
                            >
                              LOCKED
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Footer */}
          <div
            className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 relative z-10"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}
          >
            <div className="flex items-center gap-2">
              <span
                style={{
                  display: "inline-block", width: 6, height: 6, borderRadius: "50%",
                  background: done ? "#4ade80" : "#fbbf24",
                  animation: "pulse-green 1.8s ease-in-out infinite",
                  boxShadow: done ? "0 0 8px #4ade80" : "0 0 8px #fbbf24",
                  transition: "background 0.5s, box-shadow 0.5s",
                }}
              />
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: done ? "#4ade80" : "hsl(240,4%,42%)",
                  transition: "color 0.5s",
                }}
              >
                {done ? `${N}/${N} Levels · Career Active` : `${Math.max(0, unlocked + 1)}/${N} Unlocked`}
              </span>
            </div>

            {done && (
              <button
                onClick={() => { close(); setTimeout(openEmailPicker, 320); }}
                className="text-xs rounded-full px-4 py-2 cursor-pointer transition-all duration-200 hover:scale-[1.04]"
                style={{
                  fontFamily: "inherit",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  animation: "card-unlock 0.4s ease both",
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
