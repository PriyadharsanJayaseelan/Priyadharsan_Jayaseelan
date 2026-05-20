const projects = [
  {
    num: "01",
    type: "Database",
    title: "University Dining Database",
    desc: "Comprehensive SQL + Python database system. Optimized staff scheduling and inventory — cutting operational overhead significantly.",
    tags: ["SQL", "Python", "Database Design"],
  },
  {
    num: "02",
    type: "C++ System",
    title: "Inventory Tracking System",
    desc: "C++ system with custom data structures built from scratch. Improved operational efficiency by 20% through clean algorithmic design.",
    tags: ["C++", "Data Structures", "Algorithms"],
  },
  {
    num: "03",
    type: "ML Model",
    title: "Student Performance ML",
    desc: "End-to-end ML pipeline predicting at-risk students with 85% accuracy. Data cleaning, feature engineering, model evaluation.",
    tags: ["Python", "Machine Learning", "Scikit-learn"],
  },
  {
    num: "04",
    type: "VR Research",
    title: "VR IV Needle Simulation",
    desc: "Research on VR-based medical simulation. Analyzed mesh deformation and haptic feedback across 50+ participants using NASA-TLX and SUS.",
    tags: ["VR", "Research", "NASA-TLX", "SUS"],
  },
];

export default function Projects() {
  return (
    <section id="work" className="px-8 py-32 max-w-7xl mx-auto">
      {/* Label */}
      <div
        className="flex items-center gap-3 text-xs tracking-widest uppercase mb-4"
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
        className="text-5xl md:text-6xl font-normal mb-4"
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
        className="text-base mb-16 max-w-xl"
        style={{ color: "hsl(240,4%,60%)" }}
      >
        Projects at the intersection of data, systems, and real-world impact.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {projects.map((p) => (
          <div
            key={p.num}
            className="rounded-[20px] p-9 flex flex-col cursor-pointer group transition-all duration-300 relative overflow-hidden"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.18)";
              el.style.background = "rgba(255,255,255,0.04)";
              el.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.08)";
              el.style.background = "rgba(255,255,255,0.02)";
              el.style.transform = "translateY(0)";
            }}
          >
            {/* Top shimmer on hover */}
            <div
              className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
              }}
            />

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
              className="text-2xl font-normal text-white mb-3"
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
          </div>
        ))}
      </div>
    </section>
  );
}