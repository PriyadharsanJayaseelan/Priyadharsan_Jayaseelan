import { useState } from "react";

const groups = [
  {
    key: "qa",
    label: "Testing & QA",
    color: "#f87171",
    items: ["HLTS/LLTS Test Design", "Manual Testing", "Regression", "RBAC Testing", "UAT", "Requirements Traceability", "NIST SP 800-171", "ClickUp"],
  },
  {
    key: "code",
    label: "Languages & Frameworks",
    color: "#38bdf8",
    items: ["C++", "Python", "SQL", "JavaScript", "React / JSX", "Next.js", "Node.js", "Vite", "Streamlit"],
  },
  {
    key: "cloud",
    label: "Cloud & Enterprise",
    color: "#a78bfa",
    items: ["Azure DevSecOps", "Azure SQL", "Azure Static Web Apps", "Entra ID (SSO/B2B)", "SharePoint", "Microsoft 365"],
  },
  {
    key: "ai",
    label: "AI & Analytics",
    color: "#fbbf24",
    items: ["Copilot Studio (AI Agents)", "Power BI", "Tableau", "SAS", "R", "Excel"],
  },
  {
    key: "tools",
    label: "Databases & Tools",
    color: "#4ade80",
    items: ["MongoDB", "MySQL", "phpMyAdmin", "Git / GitHub", "Subversion", "Linux CLI", "VS Code", "Xcode"],
  },
];

export default function Skills() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="skills" className="px-8 py-32 max-w-7xl mx-auto">

      <h2
        className="scroll-reveal reveal-delay-1 text-5xl md:text-6xl font-normal mb-4"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: "1.05" }}
      >
        What I{" "}
        <em className="not-italic">work with.</em>
      </h2>
      <p className="scroll-reveal reveal-delay-2 text-base mb-12 max-w-xl" style={{ color: "hsl(240,4%,60%)" }}>
        Tap or hover a category to light up its tools.
      </p>

      {/* Category chips */}
      <div className="scroll-reveal reveal-delay-2 flex flex-wrap gap-3 mb-10">
        {groups.map((g) => {
          const on = active === g.key;
          return (
            <button
              key={g.key}
              onMouseEnter={() => setActive(g.key)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(g.key)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(on ? null : g.key)}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-wider uppercase cursor-pointer transition-all duration-300"
              style={{
                fontFamily: "inherit",
                border: `1px solid ${on ? g.color : "rgba(255,255,255,0.1)"}`,
                background: on ? `${g.color}14` : "transparent",
                color: on ? "#fff" : "hsl(240,4%,62%)",
                boxShadow: on ? `0 0 24px ${g.color}33` : "none",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: g.color, boxShadow: `0 0 6px ${g.color}` }} />
              {g.label}
            </button>
          );
        })}
      </div>

      {/* Tool cloud */}
      <div className="flex flex-wrap gap-3">
        {groups.flatMap((g, gi) =>
          g.items.map((item, ii) => {
            const dim = active !== null && active !== g.key;
            const lit = active === g.key;
            return (
              <span
                key={g.key + item}
                className="scroll-reveal skill-pill text-sm rounded-xl px-4 py-2.5 cursor-default"
                style={{
                  transitionDelay: `${(gi * 3 + ii) * 25}ms`,
                  border: `1px solid ${lit ? g.color + "88" : "rgba(255,255,255,0.08)"}`,
                  background: lit ? `${g.color}12` : "rgba(255,255,255,0.02)",
                  color: lit ? "#fff" : "hsl(240,4%,70%)",
                  opacity: dim ? 0.25 : undefined,
                  transform: lit ? "translateY(-3px)" : undefined,
                  boxShadow: lit ? `0 8px 24px ${g.color}22` : "none",
                }}
              >
                {item}
              </span>
            );
          })
        )}
      </div>
    </section>
  );
}
