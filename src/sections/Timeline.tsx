const timeline = [
  {
    num: "01",
    category: "Education",
    title: "Kent State University",
    org: "B.S. Computer Science · Minor in Data Analytics",
    detail:
      "Alpha Lambda Delta Honor Society · International Scholarship · GPA 3.7 · Expected Graduation 2026",
  },
  {
    num: "02",
    category: "Experience",
    title: "Lead Operations Coordinator",
    org: "Kent State University",
    detail:
      "Managed 150+ employees. Streamlined scheduling and operational workflows, reducing no-shows by 30% through data-driven process improvements.",
  },
  {
    num: "03",
    category: "Research",
    title: "VR Research Assistant",
    org: "Kent State University",
    detail:
      "Conducted user studies on VR-based medical simulation. Analyzed mesh deformation and haptic feedback data from 50+ participants using NASA-TLX and SUS evaluation frameworks.",
  },
  {
    num: "04",
    category: "Early Career",
    title: "Tech Lab Assistant",
    org: "Technology Laboratory",
    detail:
      "Supported technical operations and provided hands-on assistance in lab environments. Gained foundational experience in systems and infrastructure.",
  },
];

export default function Timeline() {
  return (
    <section className="px-8 py-32 max-w-7xl mx-auto">
      {/* Label */}
      <div
        className="scroll-reveal flex items-center gap-3 text-xs tracking-widest uppercase mb-4"
        style={{ color: "hsl(240,4%,50%)" }}
      >
        The Manifesto
        <span
          className="flex-1 h-px max-w-[80px]"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
      </div>

      {/* Title */}
      <h2
        className="scroll-reveal reveal-delay-1 text-5xl md:text-6xl font-normal mb-20"
        style={{
          fontFamily: "'Instrument Serif', serif",
          letterSpacing: "-0.02em",
          lineHeight: "1.05",
        }}
      >
        Experience &{" "}
        <em className="not-italic" style={{ color: "hsl(240,4%,66%)" }}>
          Education.
        </em>
      </h2>

      {/* Timeline */}
      <div className="flex flex-col">
        {timeline.map((item, i) => (
          <div
            key={item.num}
            className={`scroll-reveal reveal-delay-${i + 1} grid gap-8 pb-14`}
            style={{ gridTemplateColumns: "64px 1px 1fr" }}
          >
            {/* Number */}
            <div
              className="text-xs tracking-wider text-right pt-1"
              style={{ color: "hsl(240,4%,50%)" }}
            >
              {item.num}
            </div>

            {/* Line + dot */}
            <div className="relative flex justify-center">
              <div
                className="absolute top-1.5 w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  border: "1px solid rgba(255,255,255,0.35)",
                  background: "hsl(201,100%,13%)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  boxShadow: "0 0 8px rgba(255,255,255,0.1)",
                }}
              />
              {i < timeline.length - 1 && (
                <div
                  className="w-px h-full"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.03))",
                  }}
                />
              )}
            </div>

            {/* Body */}
            <div className="pb-2">
              <div
                className="text-xs tracking-widest uppercase mb-2"
                style={{ color: "hsl(240,4%,50%)" }}
              >
                {item.category}
              </div>
              <div
                className="text-2xl font-normal text-white mb-1"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {item.title}
              </div>
              <div className="text-sm mb-3" style={{ color: "hsl(240,4%,62%)" }}>
                {item.org}
              </div>
              <div
                className="text-sm leading-relaxed max-w-lg"
                style={{ color: "hsl(240,4%,50%)" }}
              >
                {item.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
