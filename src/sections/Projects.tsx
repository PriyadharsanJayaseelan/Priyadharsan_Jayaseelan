import { useState, useEffect, useRef, useCallback } from "react";

interface Project {
  num: string;
  type: string;
  title: string;
  tagline: string;
  tags: string[];
  overview: string;
  contributions: string[];
  metrics: { value: string; label: string }[];
  stack: string[];
}

const projects: Project[] = [
  {
    num: "01",
    type: "AI / Enterprise",
    title: "Federal AI Agent",
    tagline:
      "Copilot Studio agent deployed org-wide across three federal organizations.",
    tags: ["Copilot Studio", "Azure", "Entra ID"],
    overview:
      "Supporting Effort's FAST team needed to validate a real federal tech stack before development began on a client-facing AI system. I independently designed, built, and deployed a fully functional AI agent in Microsoft Copilot Studio within the federal dev environment, proving out the architecture end to end.",
    contributions: [
      "Designed and built the agent in Microsoft Copilot Studio from scratch, within the FAST dev environment.",
      "Configured SharePoint knowledge sources so the agent answers from approved internal documentation only.",
      "Enforced guardrails preventing any external data access, a hard requirement in federal environments.",
      "Implemented Entra ID (SSO/B2B) authentication to mirror the production identity setup.",
      "Deployed the agent organization-wide to Microsoft Teams through the Teams admin center.",
      "Coordinated with IT support to resolve federal authentication and knowledge source permission issues across a multi-tenant environment.",
    ],
    metrics: [
      { value: "3", label: "Federal orgs served" },
      { value: "100%", label: "Internal-only data access" },
      { value: "Org-wide", label: "Teams deployment" },
    ],
    stack: [
      "Microsoft Copilot Studio",
      "SharePoint",
      "Entra ID (SSO/B2B)",
      "Microsoft Teams",
      "Azure",
      "Multi-tenant admin",
    ],
  },
  {
    num: "02",
    type: "QA / Federal",
    title: "Federal Web Portal QA",
    tagline:
      "Sole quality gate for a secure portal and AI reporting assistant for federal leadership.",
    tags: ["Manual Testing", "UAT", "RBAC"],
    overview:
      "A secure internal web portal and AI-powered reporting assistant was being built for federal employees and senior leadership at Supporting Effort (SDVOSB, VA/DoD partner). As the quality gate, I owned test strategy and coverage for a system where security failures are not an option.",
    contributions: [
      "Authored a 33-case test plan covering security compliance, multi-tenant identity authentication, embedded dashboard reporting, role-based access control, and performance benchmarking.",
      "Led requirements gathering and documentation through stakeholder discovery sessions with federal program managers.",
      "Captured business requirements, identified risks and dependencies for the delivery roadmap.",
      "Iteratively refined test coverage with a senior QA professional, adding edge cases around security failures, browser compatibility, and identity service disruptions.",
      "Tracked sprint deliverables in ClickUp across a cross-functional team of 6 following Agile Scrum.",
    ],
    metrics: [
      { value: "33", label: "Test cases authored" },
      { value: "10+", label: "Federal agencies served" },
      { value: "6", label: "Person Scrum team" },
    ],
    stack: [
      "HLTS Test Case Format",
      "UAT",
      "Power BI",
      "ClickUp",
      "Azure DevSecOps",
      "RBAC",
      "Agile Scrum",
    ],
  },
  {
    num: "03",
    type: "Frontend / E-Commerce",
    title: "Street Stashed",
    tagline: "Pixel-perfect UI for a Next.js streetwear e-commerce platform.",
    tags: ["Next.js", "React", "TypeScript"],
    overview:
      "Street Stashed is a streetwear e-commerce startup built on Next.js, React, and TypeScript. I joined as a developer intern and was shipping impactful improvements to production within my first week.",
    contributions: [
      "Developed responsive UI components using Tailwind CSS with mobile-first principles.",
      "Resolved critical mobile layout issues affecting listings, navigation, and checkout flows.",
      "Delivered pixel-perfect implementations matched to design specs across devices.",
      "Collaborated through code reviews, sprint planning, and GitHub workflows in a cross-functional agile team.",
      "Debugged configuration and performance bottlenecks via rigorous cross-device testing.",
      "Documented builds with detailed stakeholder reports ensuring production-ready code quality.",
    ],
    metrics: [
      { value: "1 wk", label: "To first shipped improvement" },
      { value: "100%", label: "Mobile-first components" },
      { value: "3", label: "Core flows delivered" },
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GitHub", "Agile"],
  },
  {
    num: "04",
    type: "VR Research",
    title: "VR IV Needle Simulation",
    tagline: "Led VR medical simulation research with 50+ participants at Kent State.",
    tags: ["VR", "Research", "Haptics"],
    overview:
      "Medical training simulations need to feel real to be effective. I led a VR-based IV needle insertion research project at Kent State University, analyzing how mesh deformation and haptic feedback affect usability and training outcomes.",
    contributions: [
      "Led the research project analyzing mesh deformation and usability with haptic devices and VR interfaces.",
      "Designed and conducted user studies with 50+ participants.",
      "Measured cognitive workload using the NASA-TLX framework.",
      "Evaluated system usability using the SUS (System Usability Scale) methodology.",
      "Analyzed and reported findings to guide the next iteration of the simulation.",
    ],
    metrics: [
      { value: "50+", label: "Study participants" },
      { value: "2", label: "Evaluation frameworks" },
      { value: "Lead", label: "Research role" },
    ],
    stack: [
      "VR Interfaces",
      "Haptic Devices",
      "NASA-TLX",
      "SUS",
      "Quantitative Analysis",
      "User Studies",
    ],
  },
];

function ProjectModal({
  project,
  originRect,
  onClose,
}: {
  project: Project;
  originRect: DOMRect;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [closing, setClosing] = useState(false);

  // Expand on mount (double rAF so the initial card-sized frame paints first)
  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setExpanded(true))
    );
    return () => cancelAnimationFrame(raf);
  }, []);

  // Scroll lock while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const close = useCallback(() => {
    setClosing(true);
    setExpanded(false);
    setTimeout(onClose, 450);
  }, [onClose]);

  // Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const isMobile = window.innerWidth < 640;
  const finalWidth = isMobile
    ? window.innerWidth
    : Math.min(720, window.innerWidth - 48);
  const finalHeight = isMobile
    ? window.innerHeight
    : Math.min(Math.round(window.innerHeight * 0.85), 780);
  const finalTop = isMobile ? 0 : (window.innerHeight - finalHeight) / 2;
  const finalLeft = isMobile ? 0 : (window.innerWidth - finalWidth) / 2;

  const panelStyle: React.CSSProperties = expanded
    ? {
        position: "fixed",
        top: finalTop,
        left: finalLeft,
        width: finalWidth,
        height: finalHeight,
        borderRadius: isMobile ? 0 : 24,
        zIndex: 210,
      }
    : {
        position: "fixed",
        top: originRect.top,
        left: originRect.left,
        width: originRect.width,
        height: originRect.height,
        borderRadius: 20,
        zIndex: 210,
      };

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Backdrop */}
      <div
        onClick={close}
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: "rgba(0,15,30,0.7)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          opacity: expanded && !closing ? 1 : 0,
        }}
      />

      {/* Morphing panel */}
      <div
        style={{
          ...panelStyle,
          background: "hsl(201,80%,10%)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          overflow: "hidden",
          transition:
            "top 0.45s cubic-bezier(0.32,0.72,0,1), left 0.45s cubic-bezier(0.32,0.72,0,1), width 0.45s cubic-bezier(0.32,0.72,0,1), height 0.45s cubic-bezier(0.32,0.72,0,1), border-radius 0.45s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {/* Close button */}
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            opacity: expanded && !closing ? 1 : 0,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M1 1l10 10M11 1L1 11"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Scrollable content */}
        <div
          className="h-full overflow-y-auto px-8 sm:px-12 py-12 transition-opacity duration-300"
          style={{
            opacity: expanded && !closing ? 1 : 0,
            transitionDelay: expanded ? "0.15s" : "0s",
          }}
        >
          {/* Header */}
          <div
            className="text-xs tracking-widest uppercase mb-3"
            style={{ color: "hsl(240,4%,50%)" }}
          >
            {project.num} · {project.type}
          </div>
          <h3
            className="text-4xl sm:text-5xl font-normal text-white mb-3"
            style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.1 }}
          >
            {project.title}
          </h3>
          <p className="text-base mb-10" style={{ color: "hsl(240,4%,65%)" }}>
            {project.tagline}
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-xl p-4 text-center"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div
                  className="text-2xl sm:text-3xl text-white mb-1"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  {m.value}
                </div>
                <div
                  className="text-xs leading-tight"
                  style={{ color: "hsl(240,4%,55%)" }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* Overview */}
          <div
            className="text-xs tracking-widest uppercase mb-3"
            style={{ color: "hsl(240,4%,50%)" }}
          >
            Overview
          </div>
          <p
            className="text-sm leading-relaxed mb-10"
            style={{ color: "hsl(240,4%,70%)" }}
          >
            {project.overview}
          </p>

          {/* Contributions */}
          <div
            className="text-xs tracking-widest uppercase mb-4"
            style={{ color: "hsl(240,4%,50%)" }}
          >
            What I Did
          </div>
          <ul className="flex flex-col gap-3 mb-10 list-none p-0 m-0">
            {project.contributions.map((c, i) => (
              <li
                key={i}
                className="flex gap-3 text-sm leading-relaxed"
                style={{ color: "hsl(240,4%,68%)" }}
              >
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.35)" }}
                />
                {c}
              </li>
            ))}
          </ul>

          {/* Stack */}
          <div
            className="text-xs tracking-widest uppercase mb-4"
            style={{ color: "hsl(240,4%,50%)" }}
          >
            Tech & Tools
          </div>
          <div className="flex gap-2 flex-wrap pb-4">
            {project.stack.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1.5 rounded-full"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "hsl(240,4%,70%)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [active, setActive] = useState<{
    project: Project;
    rect: DOMRect;
  } | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const open = (p: Project, index: number) => {
    const el = cardRefs.current[index];
    if (el) setActive({ project: p, rect: el.getBoundingClientRect() });
  };

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
        Projects at the intersection of federal systems, AI, and real-world
        impact. Click a card for the full story.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <div
            key={p.num}
            ref={(el) => (cardRefs.current[i] = el)}
            onClick={() => open(p, i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open(p, i);
              }
            }}
            className={`scroll-reveal reveal-delay-${i + 1} card-glow shimmer-top rounded-[20px] p-9 flex flex-col cursor-pointer group`}
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div className="flex items-start justify-between mb-6">
              <div
                className="text-xs tracking-widest uppercase"
                style={{ color: "hsl(240,4%,50%)" }}
              >
                {p.num}
              </div>
              <div
                className="text-xs tracking-wider uppercase px-2 py-1 rounded"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "hsl(240,4%,55%)",
                }}
              >
                {p.type}
              </div>
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
              {p.tagline}
            </p>

            <div className="flex items-center justify-between">
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
              <span
                className="text-xs flex items-center gap-1 flex-shrink-0 ml-3 transition-all duration-200 group-hover:gap-2"
                style={{ color: "hsl(240,4%,50%)" }}
              >
                Read
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Expanding modal */}
      {active && (
        <ProjectModal
          project={active.project}
          originRect={active.rect}
          onClose={() => setActive(null)}
        />
      )}
    </section>
  );
}
