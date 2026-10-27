const certs = [
  {
    issuer: "Kent State University · Information Services",
    title: "PCI Essentials for Account Data Handlers",
    meta: "PCI DSS 4.0 · Oct 2025",
    tags: ["Data Security", "Compliance", "Cardholder Data"],
    color: "#34d399",
  },
  {
    issuer: "Udemy",
    title: "Azure DevOps Fundamentals",
    meta: "CI/CD · Boards · Repos · 2026",
    tags: ["CI/CD", "Version Control", "Agile"],
    color: "#38bdf8",
  },
  {
    issuer: "Udemy",
    title: "Power BI Masterclass",
    meta: "Dashboards · DAX · 2026",
    tags: ["Power BI", "Data Modeling", "Reporting"],
    color: "#fbbf24",
  },
  {
    issuer: "Udemy",
    title: "Agile Scrum Fundamentals",
    meta: "Scrum · Sprints · 2026",
    tags: ["Scrum", "Sprint Planning", "Delivery"],
    color: "#a78bfa",
  },
];

export default function Certifications() {
  return (
    <section className="px-8 py-32 max-w-7xl mx-auto">
      <div
        className="scroll-reveal flex items-center gap-3 text-xs tracking-widest uppercase mb-4"
        style={{ color: "hsl(240,4%,50%)" }}
      >
        Certifications
        <span className="flex-1 h-px max-w-[80px]" style={{ background: "rgba(255,255,255,0.08)" }} />
      </div>

      <h2
        className="scroll-reveal reveal-delay-1 text-5xl md:text-6xl font-normal mb-16"
        style={{ fontFamily: "'Instrument Serif', serif", letterSpacing: "-0.02em", lineHeight: "1.05" }}
      >
        Verified{" "}
        <em className="not-italic" style={{ color: "hsl(240,4%,66%)" }}>Credentials.</em>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {certs.map((c, i) => (
          <div
            key={c.title}
            className={`scroll-reveal reveal-delay-${(i % 4) + 1} tilt-card card-glow shimmer-top rounded-[20px] p-8 relative overflow-hidden`}
            style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
          >
            <div
              aria-hidden
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${c.color}22 0%, transparent 70%)` }}
            />
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs tracking-widest uppercase" style={{ color: "hsl(240,4%,55%)" }}>
                {c.issuer}
              </div>
              <span
                className="inline-flex items-center gap-1.5 text-[10px] tracking-widest"
                style={{ color: c.color, fontFamily: "monospace" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
                  style={{ background: c.color, boxShadow: `0 0 8px ${c.color}` }}
                />
                VERIFIED
              </span>
            </div>
            <h3
              className="text-2xl font-normal text-white mb-2"
              style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.2 }}
            >
              {c.title}
            </h3>
            <p className="text-sm mb-6" style={{ color: "hsl(240,4%,62%)" }}>{c.meta}</p>
            <div className="flex flex-wrap gap-2">
              {c.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", color: "hsl(240,4%,62%)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
