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
    type: "QA / Federal Security",
    title: "Federal Intranet Portal QA",
    tagline:
      "51-case test framework that caught a critical privilege-escalation bug before it shipped.",
    tags: ["RBAC", "UAT", "Traceability"],
    overview:
      "Pivotal ITS's FAST team was building a secure, role-based intranet portal and AI reporting assistant for federal clients including the VA/VHA, DoD and GSA. I owned test design end to end, where a single permissions bug can expose restricted data.",
    contributions: [
      "Designed a 51-case test framework and a 22-case regression suite, with full requirements traceability from user story to UAT on every release.",
      "Surfaced a critical privilege-escalation defect: report metadata changes silently bypassed RBAC clearance checks and exposed restricted data to unauthorized roles. Root-caused it and drove the fix with development.",
      "Validated Power BI embedded analytics and multi-tenant access end to end, isolating dashboard load failures, permission gaps and workspace misconfigurations.",
      "Diagnosed deployment failures across Azure SQL firewall ACLs, SPA deep-link routing and UTC/EST timezone drift, and coordinated fixes across IT and development.",
    ],
    metrics: [
      { value: "51", label: "Test cases designed" },
      { value: "22", label: "Regression cases" },
      { value: "1", label: "Critical RBAC bug caught" },
    ],
    stack: ["HLTS/LLTS", "RBAC Testing", "UAT", "Power BI", "Azure SQL", "Entra ID", "NIST SP 800-171", "ClickUp"],
  },
  {
    num: "02",
    type: "AI / Enterprise",
    title: "Copilot Studio AI Agent",
    tagline:
      "Proof-of-concept AI agent whose auth and knowledge pattern was adopted for production.",
    tags: ["Copilot Studio", "SharePoint", "Entra ID"],
    overview:
      "Before the production AI reporting assistant was built, the team needed proof that the Microsoft stack could work inside a federal environment. I built and published a proof-of-concept agent on my own, then built the validation suite for the real assistant.",
    contributions: [
      "Built and published a proof-of-concept AI agent in Microsoft Copilot Studio, completing the full publishing workflow.",
      "Set up the SharePoint knowledge-sourcing and Entra ID authentication pattern that the production assistant later adopted.",
      "Built an 80+ question validation suite across 10+ test categories for the AI reporting assistant.",
      "Checked every expected answer against raw source data so the assistant had full coverage before release.",
    ],
    metrics: [
      { value: "80+", label: "Validation questions" },
      { value: "10+", label: "Test categories" },
      { value: "Prod", label: "Pattern adopted" },
    ],
    stack: ["Microsoft Copilot Studio", "SharePoint", "Entra ID (SSO/B2B)", "Microsoft 365", "Azure"],
  },
  {
    num: "03",
    type: "Full-Stack / Team",
    title: "RollCall",
    tagline: "ROTC attendance platform. I built the Event Management module from a blank file.",
    tags: ["Streamlit", "MongoDB", "RBAC"],
    overview:
      "RollCall is an attendance tracking platform for an ROTC detachment, built by a student team. I owned the Event Management module and several pieces of the app's foundation.",
    contributions: [
      "Built Event Management end to end: event creation, auto-populated event types, and inline editing with pre-filled forms.",
      "Resolved 4 reviewer-flagged issues across two PR review cycles, including a database update-tracking bug that reported valid edits as failures.",
      "Replaced a hardcoded PT/LLAB weekday schedule with a database-backed settings page, with role-based access for admin, cadre, flight commander and cadet.",
      "Designed the app's SVG logo and wrote the full README: architecture, setup, environment config and contributor guidelines.",
    ],
    metrics: [
      { value: "4", label: "User roles" },
      { value: "4", label: "Review issues resolved" },
      { value: "0→1", label: "Module built" },
    ],
    stack: ["Python", "Streamlit", "MongoDB", "streamlit-authenticator", "Git/GitHub"],
  },
  {
    num: "04",
    type: "Frontend / E-Commerce",
    title: "StreetStashed Search Fix",
    tagline: "Restored broken marketplace search and made filtered links shareable.",
    tags: ["Next.js", "React", "URL State"],
    overview:
      "StreetStashed is a fashion and lifestyle delivery platform. Marketplace search was broken in production. I found why, fixed it, and fixed two more bugs I found along the way.",
    contributions: [
      "Traced the search failure to component state that never synced with URL parameters, then built a useSearchParams/useEffect sync layer across search and filters.",
      "Found and fixed two more defects in testing: category filters silently not applying, and search state resetting on refresh.",
      "Made filtered views persistent and shareable by extending URL-parameter handling.",
      "Fixed broken image placeholders on every product page with error-safe fallbacks, loop prevention and lazy loading, then swapped in a branded asset.",
    ],
    metrics: [
      { value: "3", label: "Defects fixed" },
      { value: "100%", label: "Product pages fixed" },
      { value: "E2E", label: "Search restored" },
    ],
    stack: ["Next.js", "React", "TypeScript", "useSearchParams", "Tailwind CSS", "GitHub"],
  },
  {
    num: "05",
    type: "VR Research",
    title: "VR IV Needle Usability Study",
    tagline: "Turned 5,000+ raw responses into learning-curve trends that reshaped training.",
    tags: ["VR", "Haptics", "Data Analysis"],
    overview:
      "Kent State researchers were testing whether VR and haptic simulation can teach IV needle insertion. I ran the sessions and turned the raw data into findings the team used to redesign the training.",
    contributions: [
      "Ran VR and haptic IV insertion simulations for 50+ biotech students across 100+ attempts each.",
      "Calibrated headsets and haptic devices and guided standardized NASA-TLX and SUS assessments.",
      "Cleaned and structured 5,000+ raw usability responses into trial-range datasets.",
      "Computed average SUS and NASA-TLX workload scores to show learning-curve trends that informed the training redesign.",
    ],
    metrics: [
      { value: "50+", label: "Participants" },
      { value: "5K+", label: "Responses analyzed" },
      { value: "100+", label: "Attempts each" },
    ],
    stack: ["VR Headsets", "Haptic Devices", "NASA-TLX", "SUS", "Google Sheets", "Data Cleaning"],
  },
  {
    num: "06",
    type: "Frontend / Design",
    title: "This Portfolio",
    tagline: "Hand-built React site with a live ECG career tracker and zero animation libraries.",
    tags: ["React", "TypeScript", "SVG"],
    overview:
      "I wanted a portfolio that feels like a product, not a resume. Every animation here is written by hand in React, CSS and SVG, with no animation library, and it deploys automatically through GitHub Actions.",
    contributions: [
      "Built with React 18, TypeScript, Vite and Tailwind, deployed to GitHub Pages through a CI workflow.",
      "Designed a live ECG 'heartbeat' career tracker: an SVG path draws itself and unlocks nine career levels like a game.",
      "Wrote custom hooks for scroll reveal, hero parallax, animated counters, 3D card tilt and a cursor spotlight.",
      "Respects prefers-reduced-motion and works on phone and desktop.",
    ],
    metrics: [
      { value: "0", label: "Animation libraries" },
      { value: "9", label: "Career levels" },
      { value: "CI", label: "Auto-deploy" },
    ],
    stack: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "SVG", "GitHub Actions"],
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
          background: "rgba(0,0,0,0.78)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          opacity: expanded && !closing ? 1 : 0,
        }}
      />

      {/* Morphing panel */}
      <div
        style={{
          ...panelStyle,
          background: "#0B0B0D",
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
            style={{ fontFamily: "var(--font-display)", lineHeight: 1.1 }}
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
                  className="text-xl sm:text-3xl text-white mb-1"
                  style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" }}
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

      {/* Title */}
      <h2
        className="scroll-reveal reveal-delay-1 text-5xl md:text-6xl font-normal mb-4"
        style={{
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.02em",
          lineHeight: "1.05",
        }}
      >
        The{" "}
        <em className="not-italic">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            className={`scroll-reveal reveal-delay-${(i % 3) + 1} tilt-card card-glow shimmer-top rounded-[20px] p-9 flex flex-col cursor-pointer group`}
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
                fontFamily: "var(--font-display)",
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
