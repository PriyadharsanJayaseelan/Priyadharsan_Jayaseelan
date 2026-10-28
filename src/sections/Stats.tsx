import { useCounter } from "../hooks/useCounter";

const stats = [
  { target: 3.5, display: "3.5", suffix: "", label: "GPA · Kent State University", sub: "B.S. Computer Science, Minor in Data Analytics · Alpha Lambda Delta · May 2027" },
  { target: 51, display: "51", suffix: "", label: "Federal Test Cases Designed", sub: "Role-based intranet portal + 22-case regression suite · VA/VHA, DoD, GSA" },
  { target: 80, display: "80", suffix: "+", label: "AI Validation Questions", sub: "Across 10+ test categories, each checked against raw source data" },
  { target: 200, display: "200", suffix: "+", label: "Student Employees Scheduled", sub: "Kent State dining ops · 30% fewer no-shows · 25% fewer stockouts" },
];

function StatCard({ s, delay }: { s: typeof stats[0]; delay: number }) {
  const { count, ref } = useCounter(s.target * (s.display.includes(".") ? 10 : 1));
  const displayed = s.display.includes(".")
    ? (count / 10).toFixed(1)
    : count;

  return (
    <div
      ref={ref}
      className={`scroll-reveal reveal-delay-${delay} tilt-card card-glow shimmer-top rounded-2xl p-8 cursor-default`}
      style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
    >
      <div
        className="text-6xl font-normal mb-3 text-white"
        style={{ fontFamily: "var(--font-display)", lineHeight: 1 }}
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

      <h2
        className="scroll-reveal reveal-delay-1 text-5xl md:text-6xl font-normal mb-16"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: "1.05" }}
      >
        Numbers that{" "}
        <em className="not-italic">speak.</em>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <StatCard key={s.label} s={s} delay={i + 1} />
        ))}
      </div>

      <div className="mt-24">
      <div
        className="scroll-reveal reveal-delay-2 pl-8"
        style={{ borderLeft: "2px solid rgba(255,255,255,0.1)" }}
      >
        <p
          className="text-2xl md:text-3xl font-normal mb-4"
          style={{ color: "hsl(40,10%,80%)", lineHeight: 1.4, fontStyle: "italic" }}
        >
          "I break things on purpose, so they never break for the people who depend on them."
        </p>
        <p className="text-sm" style={{ color: "hsl(240,4%,50%)" }}>
          Priyadharsan Jayaseelan
        </p>
      </div>
      </div>
    </section>
  );
}
