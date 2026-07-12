const projects = [
  {
    num: "01",
    type: "AI / Enterprise",
    title: "Federal AI Agent, Copilot Studio",
    desc: "Independently designed, built, and deployed a fully functional AI agent in Microsoft Copilot Studio within Supporting Effort's federal dev environment. Configured SharePoint knowledge sources, enforced external data guardrails, implemented Entra ID (SSO/B2B) authentication, and deployed org-wide via Microsoft Teams, serving three federal organizations including VA, DoD, and Army.",
    tags: ["Copilot Studio", "Azure", "SharePoint", "Entra ID", "Teams"],
  },
  {
    num: "02",
    type: "QA / Federal",
    title: "Federal Web Portal, 33-Case Test Plan",
    desc: "Sole quality gate for a secure internal web portal and AI-powered reporting assistant built for federal employees and senior leadership at Supporting Effort (SDVOSB, VA/DoD partner). Authored a 33-case test plan covering security compliance, multi-tenant identity authentication, embedded Power BI dashboard reporting, RBAC, and performance benchmarking across a federal cloud environment.",
    tags: ["Manual Testing", "UAT", "Power BI", "RBAC", "Azure DevSecOps"],
  },
  {
    num: "03",
    type: "Frontend / E-Commerce",
    title: "Street Stashed, Streetwear Platform",
    desc: "Developed responsive UI components for a Next.js, React & TypeScript streetwear e-commerce platform using Tailwind CSS with mobile-first principles. Resolved critical mobile layout issues and delivered pixel-perfect listings, navigation, and checkout flows within the first week.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    num: "04",
    type: "VR Research",
    title: "VR IV Needle Simulation",
    desc: "Led a VR-based IV needle insertion research project analyzing mesh deformation and usability with haptic devices and VR interfaces across 50+ participants. Reported findings using NASA-TLX and SUS usability evaluation frameworks.",
    tags: ["VR", "Research", "NASA-TLX", "SUS", "Haptics"],
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
        Projects at the intersection of federal systems, AI, and real-world impact.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <div
            key={p.num}
            className={`scroll-reveal reveal-delay-${i + 1} card-glow shimmer-top rounded-[20px] p-9 flex flex-col`}
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
