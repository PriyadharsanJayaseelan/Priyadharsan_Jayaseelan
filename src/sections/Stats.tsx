const stats = [
  {
    num: "3.7",
    label: "GPA · Kent State University",
    sub: "Alpha Lambda Delta Honor Society · International Scholarship",
  },
  {
    num: "150+",
    label: "Employees Managed",
    sub: "Lead Operational Coordinator · Reduced no-shows by 30%",
  },
  {
    num: "85%",
    label: "Model Accuracy",
    sub: "Student performance prediction pipeline · Python · Scikit-learn",
  },
  {
    num: "50+",
    label: "Research Participants",
    sub: "IV Needle Simulation · NASA-TLX · SUS metrics analysis",
  },
];

export default function Stats() {
  return (
    <section id="about" className="px-8 py-32 max-w-7xl mx-auto">
      {/* Label */}
      <div
        className="flex items-center gap-3 text-xs tracking-widest uppercase mb-4"
        style={{ color: "hsl(240,4%,50%)" }}
      >
        What Sets Me Apart
        <span
          className="flex-1 h-px max-w-[80px]"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
      </div>

      {/* Title */}
      <h2
        className="text-5xl md:text-6xl font-normal mb-16"
        style={{
          fontFamily: "'Instrument Serif', serif",
          letterSpacing: "-0.02em",
          lineHeight: "1.05",
        }}
      >
        Numbers that{" "}
        <em className="not-italic" style={{ color: "hsl(240,4%,66%)" }}>
          speak.
        </em>
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-8 transition-all duration-300 cursor-default"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.18)";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.02)";
            }}
          >
            <div
              className="text-6xl font-normal mb-3 text-white"
              style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1 }}
            >
              {s.num}
            </div>
            <div className="text-sm font-medium text-white mb-1">{s.label}</div>
            <div
              className="text-xs leading-relaxed"
              style={{ color: "hsl(240,4%,60%)" }}
            >
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div
        className="mt-24 pl-8"
        style={{ borderLeft: "1px solid rgba(255,255,255,0.15)" }}
      >
        <p
          className="text-2xl md:text-3xl font-normal mb-4"
          style={{
            fontFamily: "'Instrument Serif', serif",
            color: "hsl(240,4%,75%)",
            lineHeight: 1.4,
          }}
        >
          "Building things that actually matter."
        </p>
        <p className="text-sm" style={{ color: "hsl(240,4%,50%)" }}>
          — Priyadharsan Jayaseelan
        </p>
      </div>
    </section>
  );
}