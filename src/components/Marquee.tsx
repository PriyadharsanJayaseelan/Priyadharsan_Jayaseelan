const items = [
  "Design",
  "Build",
  "Deploy",
  "C++",
  "Python",
  "SQL",
  "TypeScript",
  "Next.js",
  "React",
  "Machine Learning",
  "Microsoft Azure",
  "Copilot Studio",
  "Power BI",
  "SharePoint",
  "Data Analytics",
  "Federal Systems",
  "VR Research",
  "Agile Scrum",
  "Kent State University",
];

export default function Marquee() {
  const doubled = [...items, ...items];

  return (
    <div
      className="relative z-10 overflow-hidden py-4"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(0,0,0,0.2)",
      }}
    >
      <div className="flex gap-10 whitespace-nowrap animate-marquee">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-10 text-xs tracking-widest uppercase flex-shrink-0"
            style={{ color: "hsl(240,4%,55%)" }}
          >
            {item}
            <span
              className="inline-block w-1 h-1 rounded-full"
              style={{ background: "hsl(240,4%,45%)" }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
