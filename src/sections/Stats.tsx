import { useCounter } from "../hooks/useCounter";

const stats = [
  { target: 3.5, display: "3.5", suffix: "", label: "GPA · Kent State University", sub: "Alpha Lambda Delta Honor Society · International Scholarship · May 2027" },
  { target: 10, display: "10", suffix: "+", label: "Federal Agencies Supported", sub: "VA, DoD, USPTO, FDA, HHS, HUD, USDA, DLA, Army & more · Supporting Effort FAST Team" },
  { target: 33, display: "33", suffix: "", label: "Test Cases Authored", sub: "Federal cloud portal · Security, RBAC, auth & performance benchmarking" },
  { target: 50, display: "50", suffix: "+", label: "Research Participants", sub: "VR IV Needle Simulation · NASA-TLX · SUS usability metrics" },
];

function StatCard({ s, delay }: { s: typeof stats[0]; delay: number }) {
  const { count, ref } = useCounter(s.target * (s.display.includes(".") ? 10 : 1));
  const displayed = s.display.includes(".")
    ? (count / 10).toFixed(1)
    : count;

  return (
    <div
      ref={ref}
      className={`scroll-reveal reveal-delay-${delay} card-glow shimmer-top rounded-2xl p-8 cursor-default`}
      style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
    >
      <div
        className="text-6xl font-normal mb-3 text-white"
        style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1 }}
      >
        {displayed}{s.suffix}
      </div>
      <div className="text-sm font-medium text-white mb-1">{s.label}</div>
      <div className="text-xs leading-relaxed" style={{ color: "hsl(240,4%,60%)" }}>
        {s.sub}
      </div>
    </div>
  );
}

export default function Stats() {
  return (
    <section id="about" className="px-8 py-32 max-w-7xl mx-auto">
      <div
        className="scroll-reveal flex items-center gap-3 text-xs tracking-widest uppercase mb-4"
        style={{ color: "hsl(240,4%,50%)" }}
      >
        What Sets Me Apart
        <span className="flex-1 h-px max-w-[80px]" style={{ background: "rgba(255,255,255,0.08)" }} />
      </div>

      <h2
        className="scroll-reveal reveal-delay-1 text-5xl md:text-6xl font-normal mb-16"
        style={{ fontFamily: "'Instrument Serif', serif", letterSpacing: "-0.02em", lineHeight: "1.05" }}
      >
        Numbers that{" "}
        <em className="not-italic" style={{ color: "hsl(240,4%,66%)" }}>speak.</em>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <StatCard key={s.label} s={s} delay={i + 1} />
        ))}
      </div>

      <div
        className="scroll-reveal reveal-delay-2 mt-24 pl-8"
        style={{ borderLeft: "2px solid rgba(255,255,255,0.1)" }}
      >
        <p
          className="text-2xl md:text-3xl font-normal mb-4"
          style={{ fontFamily: "'Instrument Serif', serif", color: "hsl(240,4%,75%)", lineHeight: 1.4 }}
        >
          "Building things that actually matter."
        </p>
        <p className="text-sm" style={{ color: "hsl(240,4%,50%)" }}>
          Priyadharsan Jayaseelan
        </p>
      </div>
    </section>
  );
}
