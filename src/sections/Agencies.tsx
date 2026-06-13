const agencies = [
  {
    abbr: "VA",
    name: "Dept. of Veterans Affairs",
    icon: "🏥",
    color: "rgba(29,78,148,0.25)",
    border: "rgba(29,78,148,0.5)",
  },
  {
    abbr: "DoD",
    name: "Dept. of Defense",
    icon: "🛡️",
    color: "rgba(30,58,95,0.25)",
    border: "rgba(30,58,95,0.5)",
  },
  {
    abbr: "Army",
    name: "U.S. Army",
    icon: "⭐",
    color: "rgba(34,65,34,0.25)",
    border: "rgba(34,65,34,0.5)",
  },
  {
    abbr: "USPTO",
    name: "Patent & Trademark Office",
    icon: "⚖️",
    color: "rgba(80,40,100,0.25)",
    border: "rgba(80,40,100,0.5)",
  },
  {
    abbr: "USDA",
    name: "Dept. of Agriculture",
    icon: "🌾",
    color: "rgba(34,80,50,0.25)",
    border: "rgba(34,80,50,0.5)",
  },
  {
    abbr: "DLA",
    name: "Defense Logistics Agency",
    icon: "🚢",
    color: "rgba(20,50,100,0.25)",
    border: "rgba(20,50,100,0.5)",
  },
  {
    abbr: "FDA",
    name: "Food & Drug Administration",
    icon: "🔬",
    color: "rgba(100,60,20,0.25)",
    border: "rgba(100,60,20,0.5)",
  },
  {
    abbr: "HHS",
    name: "Health & Human Services",
    icon: "❤️",
    color: "rgba(100,20,60,0.25)",
    border: "rgba(100,20,60,0.5)",
  },
  {
    abbr: "HUD",
    name: "Housing & Urban Dev.",
    icon: "🏛️",
    color: "rgba(20,80,80,0.25)",
    border: "rgba(20,80,80,0.5)",
  },
  {
    abbr: "MD",
    name: "State of Maryland",
    icon: "🦅",
    color: "rgba(80,20,20,0.25)",
    border: "rgba(80,20,20,0.5)",
  },
];

function AgencyBadge({
  a,
}: {
  a: (typeof agencies)[0];
}) {
  return (
    <div
      className="flex-shrink-0 flex items-center gap-4 px-5 py-3.5 rounded-2xl mx-3 transition-all duration-300 cursor-default"
      style={{
        background: a.color,
        border: `1px solid ${a.border}`,
        minWidth: "200px",
      }}
    >
      {/* Icon circle */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {a.icon}
      </div>

      {/* Text */}
      <div>
        <div
          className="text-xs font-semibold tracking-wider text-white mb-0.5"
          style={{ letterSpacing: "0.05em" }}
        >
          {a.abbr}
        </div>
        <div
          className="text-xs leading-tight"
          style={{ color: "hsl(240,4%,62%)", maxWidth: "130px" }}
        >
          {a.name}
        </div>
      </div>
    </div>
  );
}

export default function Agencies() {
  const doubled = [...agencies, ...agencies];

  return (
    <section className="py-24 max-w-7xl mx-auto px-8">
      {/* Label */}
      <div
        className="scroll-reveal flex items-center gap-3 text-xs tracking-widest uppercase mb-4"
        style={{ color: "hsl(240,4%,50%)" }}
      >
        Federal Agencies Served
        <span
          className="flex-1 h-px max-w-[80px]"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
      </div>

      <h2
        className="scroll-reveal reveal-delay-1 text-5xl md:text-6xl font-normal mb-4"
        style={{
          fontFamily: "'Instrument Serif', serif",
          letterSpacing: "-0.02em",
          lineHeight: "1.05",
        }}
      >
        Trusted by{" "}
        <em className="not-italic" style={{ color: "hsl(240,4%,66%)" }}>
          government.
        </em>
      </h2>

      <p
        className="scroll-reveal reveal-delay-2 text-base mb-14 max-w-xl"
        style={{ color: "hsl(240,4%,60%)" }}
      >
        Supporting federal modernization across defense, healthcare, agriculture,
        and civil agencies — through Supporting Effort's FAST Team.
      </p>

      {/* Carousel rows */}
      <div className="scroll-reveal reveal-delay-3 relative overflow-hidden">
        {/* Fade edges */}
        <div
          className="absolute inset-y-0 left-0 z-10 w-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, hsl(201,100%,13%), transparent)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 z-10 w-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, hsl(201,100%,13%), transparent)",
          }}
        />

        {/* Row 1 — scrolls left */}
        <div className="flex mb-4 animate-marquee" style={{ width: "max-content" }}>
          {doubled.map((a, i) => (
            <AgencyBadge key={i} a={a} />
          ))}
        </div>

        {/* Row 2 — scrolls right (offset start) */}
        <div
          className="flex animate-marquee-reverse"
          style={{ width: "max-content" }}
        >
          {[...agencies.slice(5), ...agencies.slice(0, 5), ...agencies.slice(5), ...agencies.slice(0, 5)].map(
            (a, i) => (
              <AgencyBadge key={i} a={a} />
            )
          )}
        </div>
      </div>
    </section>
  );
}
