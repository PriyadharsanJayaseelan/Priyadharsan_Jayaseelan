import { useState } from "react";

/* TARS from Interstellar: "Humor 75%." Visitors can tune my settings. */
const SETTINGS = [
  { key: "honesty", label: "Honesty", value: 100 },
  { key: "humor", label: "Humor", value: 75 },
  { key: "curiosity", label: "Curiosity", value: 100 },
  { key: "bugs", label: "Bug tolerance", value: 0 },
];

function reply(key: string, v: number) {
  if (key === "honesty") return v < 100 ? "Absolute honesty isn't always diplomatic. But in QA it's the job. Back to 100%." : "Honesty at 100%. Every bug gets reported.";
  if (key === "humor") return v > 90 ? "Humor 90%? Let's keep it at 75. The bug reports need to be readable." : v < 30 ? "Humor below 30%. That's a lonely sprint." : `Humor at ${v}%. Self-destruct sequence in T minus 10... just kidding.`;
  if (key === "curiosity") return v < 100 ? "Curiosity can't go below 100%. That's how the bugs get found." : "Curiosity 100%. Still asking 'what if the user does this?'";
  return v > 0 ? `Bug tolerance ${v}%? Not on my watch. Resetting to 0.` : "Bug tolerance 0%. As designed.";
}

export default function Tars() {
  const [vals, setVals] = useState<Record<string, number>>(Object.fromEntries(SETTINGS.map((s) => [s.key, s.value])));
  const [msg, setMsg] = useState("Settings loaded. Try adjusting one.");

  const change = (key: string, v: number) => {
    setVals((x) => ({ ...x, [key]: v }));
    setMsg(reply(key, v));
  };
  const release = (key: string) => {
    // TARS has opinions: some settings snap back
    const snap = key === "honesty" || key === "curiosity" ? 100 : key === "bugs" ? 0 : key === "humor" && vals.humor > 90 ? 75 : null;
    if (snap !== null) setTimeout(() => setVals((x) => ({ ...x, [key]: snap })), 500);
  };

  return (
    <div className="tars scroll-reveal">
      <div className="tars-head">
        <span className="tars-dot" /> TARS · personality settings
      </div>
      <div className="grid gap-5 mt-5">
        {SETTINGS.map((s) => (
          <label key={s.key} className="block">
            <div className="flex justify-between term-line text-[13px] mb-2">
              <span>{s.label}</span>
              <span className="text-[var(--gold)]">{vals[s.key]}%</span>
            </div>
            <input
              type="range" min={0} max={100} value={vals[s.key]}
              onChange={(e) => change(s.key, +e.target.value)}
              onPointerUp={() => release(s.key)}
              onKeyUp={() => release(s.key)}
              className="tars-range"
              style={{ ["--v" as string]: `${vals[s.key]}%` }}
              aria-label={s.label}
            />
          </label>
        ))}
      </div>
      <p className="term-line text-[13px] mt-6 min-h-[2.6em]" aria-live="polite">
        <span className="text-[var(--gold)]">TARS&gt;</span> {msg}
      </p>
    </div>
  );
}
