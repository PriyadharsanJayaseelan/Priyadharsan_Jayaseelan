const projects = [
  {
    num: "01",
    type: "Database",
    title: "University Dining Database",
    desc: "Comprehensive SQL + Python database system. Optimized staff scheduling and inventory — cutting operational overhead significantly.",
    tags: ["SQL", "Python", "Database Design"],
    href: "https://github.com/PriyadharsanJayaseelan",
  },
  {
    num: "02",
    type: "C++ System",
    title: "Inventory Tracking System",
    desc: "C++ system with custom data structures built from scratch. Improved operational efficiency by 20% through clean algorithmic design.",
    tags: ["C++", "Data Structures", "Algorithms"],
    href: "https://github.com/PriyadharsanJayaseelan",
  },
  {
    num: "03",
    type: "ML Model",
    title: "Student Performance ML",
    desc: "End-to-end ML pipeline predicting at-risk students with 85% accuracy. Data cleaning, feature engineering, model evaluation.",
    tags: ["Python", "Machine Learning", "Scikit-learn"],
    href: "https://github.com/PriyadharsanJayaseelan",
  },
  {
    num: "04",
    type: "VR Research",
    title: "VR IV Needle Simulation",
    desc: "Research on VR-based medical simulation. Analyzed mesh deformation and haptic feedback across 50+ participants using NASA-TLX and SUS.",
    tags: ["VR", "Research", "NASA-TLX", "SUS"],
    href: "https://github.com/PriyadharsanJayaseelan",
  },
];

export default function Projects() {
  return (
    <section id="work" className="px-8 py-32 max-w-7xl mx-auto">
      {/* Label */}
      <div
        className="scroll-reveal flex items-center gap-3 text-xs tracking-widest uppercase mb-4"
        style={{ color: "hsl(240,4%,50%)" }}
      >
        Selected Work
        <span
          className="flex-1 h-px max-w-[80px]"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
      </div>

      {/* Title */}
      <h2
        className="scroll-reveal reveal-delay-1 text-5xl md:text-6xl font-normal mb-4"
        style={{
          fontFamily: "'Instrument Serif', serif",
          letterSpacing: "-0.02em",
          lineHeight: "1.05",
        }}
      >
        The{" "}
        <em className="not-italic" style={{ color: "hsl(240,4%,66%)" }}>
          Work.
        </em>
      </h2>
      <p
        className="scroll-reveal reveal-delay-2 text-base mb-16 max-w-xl"
        style={{ color: "hsl(240,4%,60%)" }}
      >
        Projects at the intersection of data, systems, and real-world impact.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <a
            key={p.num}
            href={p.href}
            target="_blank"
            rel="noreferrer"
            className={`scroll-reveal reveal-delay-${i + 1} no-underline card-glow shimmer-top rounded-[20px] p-9 flex flex-col cursor-pointer group`}
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div
              className="text-xs tracking-widest uppercase mb-6"
              style={{ color: "hsl(240,4%,50%)" }}
            >
              {p.num}
            </div>

            <div
              className="self-start text-xs tracking-wider uppercase mb-5 px-2 py-1 rounded"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                color: "hsl(240,4%,55%)",
              }}
            >
              {p.type}
            </div>

            <h3
              className="text-2xl font-normal text-white mb-3 transition-colors duration-200 group-hover:text-white"
              style={{
                fontFamily: "'Instrument Serif', serif",
                lineHeight: "1.2",
              }}
            >
              {p.title}
            </h3>

            <p
              className="text-sm leading-relaxed flex-1 mb-6"
              style={{ color: "hsl(240,4%,62%)" }}
            >
              {p.desc}
            </p>

            <div className="flex gap-2 flex-wrap">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "hsl(240,4%,62%)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* View arrow */}
            <div
              className="mt-6 text-xs flex items-center gap-1.5 transition-all duration-200 group-hover:gap-2.5"
              style={{ color: "hsl(240,4%,45%)" }}
            >
              View on GitHub
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                ↗
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
