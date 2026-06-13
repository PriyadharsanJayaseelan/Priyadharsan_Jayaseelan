const timeline = [
  {
    num: "01",
    category: "Experience · Current",
    title: "Software Test Engineer Intern",
    org: "Pivotal ITS · Federal Advanced Solutions Team (FAST) · Supporting Effort · May 2026 – Present",
    detail:
      "Supporting Effort is a Veteran-owned SDVOSB and federal modernization partner (Zero Delta + i4DM joint venture, 11+ years). Serving as quality gate for a secure internal web portal and AI-powered reporting assistant used by federal employees across VA, DoD, USPTO, FDA, HHS, HUD, USDA, DLA, Army, and State of Maryland. Independently designed, built, and deployed an AI agent in Microsoft Copilot Studio — pushed org-wide via Teams. Led requirements gathering with federal program managers across a 6-person Agile Scrum team.",
  },
  {
    num: "02",
    category: "Experience",
    title: "Software Developer Intern",
    org: "Street Stashed · Jan 2026 – March 2026",
    detail:
      "Built responsive UI components for a Next.js, React & TypeScript streetwear e-commerce platform using Tailwind CSS. Resolved critical mobile layout issues, delivered pixel-perfect checkout flows, and collaborated through code reviews and sprint planning in a cross-functional agile environment.",
  },
  {
    num: "03",
    category: "Research",
    title: "VR Research Assistant",
    org: "Kent State University",
    detail:
      "Led a VR-based IV needle insertion research project analyzing mesh deformation and usability with haptic devices. Conducted user studies with 50+ participants and reported findings using NASA-TLX and SUS evaluation frameworks.",
  },
  {
    num: "04",
    category: "Education",
    title: "Kent State University",
    org: "B.S. Computer Science · Minor in Data Analytics · GPA 3.5 · Aug 2023 – May 2027",
    detail:
      "Alpha Lambda Delta Honor Society · International Scholarship. Coursework spanning data structures, algorithms, database systems, machine learning, and data analytics.",
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
                className="absolute top-1.5 w-2.5 h-2.5 rounded-full"
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
