import { useRef } from "react";
import Typewriter from "../components/Typewriter";
import HoloCrystal from "../components/HoloCrystal";
import { openEmailPicker } from "../components/EmailPicker";
import { openStoryModal } from "../components/StoryModal";
import { useHeroParallax } from "../hooks/useHeroParallax";

/* HUD readouts. Every number comes straight from the resume. */
function Panel({
  title,
  status,
  children,
  panelRef,
  className = "",
  delay,
}: {
  title: string;
  status: string;
  children: React.ReactNode;
  panelRef?: React.Ref<HTMLDivElement>;
  className?: string;
  delay: number;
}) {
  return (
    <div
      ref={panelRef}
      className={`hud-panel ${className.includes("absolute") ? "" : "relative"} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="hud-title">{title}</span>
        <span className="hud-status">{status}</span>
      </div>
      {children}
    </div>
  );
}

function Bars() {
  const heights = [38, 62, 48, 80, 56, 92, 70, 86, 64, 100];
  return (
    <div className="flex items-end gap-[3px] h-9 mt-2" aria-hidden="true">
      {heights.map((v, i) => (
        <span key={i} className="hud-bar" style={{ height: `${v}%`, animationDelay: `${1400 + i * 70}ms` }} />
      ))}
    </div>
  );
}

const IconGitHub = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);
const IconLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);

export default function Hero() {
  const { videoRef, badgeRef, bodyRef } = useHeroParallax();

  // stable ref list so the canvas effect only runs once
  const panelRefs = useRef([
    { current: null as HTMLDivElement | null },
    { current: null as HTMLDivElement | null },
    { current: null as HTMLDivElement | null },
    { current: null as HTMLDivElement | null },
  ]).current as React.RefObject<HTMLDivElement>[];

  return (
    <section id="hero" className="hero-grid relative min-h-screen overflow-hidden">
      {/* ambient glows */}
      <div aria-hidden className="absolute -top-40 -left-40 w-[620px] h-[620px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(92,225,230,0.10), transparent 65%)" }} />
      <div aria-hidden className="absolute top-1/3 -right-40 w-[560px] h-[560px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,124,246,0.12), transparent 65%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-28 pb-20 lg:pt-32 grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-6 items-center min-h-screen">
        {/* ── Text column ── */}
        <div ref={bodyRef} style={{ willChange: "transform, opacity" }}>
          <div ref={badgeRef} className="hero-in inline-flex items-center gap-2.5 text-sm mb-7" style={{ color: "var(--dim)" }}>
            <span className="w-2 h-2 rounded-full animate-pulse-dot" style={{ background: "var(--cyan)", boxShadow: "0 0 10px var(--cyan)" }} />
            Open to 2027 new-grad and internship roles
          </div>

          <h1
            className="hero-in text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.4rem] font-semibold text-white"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.025em", animationDelay: "120ms" }}
          >
            I find the bugs<br />before your users do.
          </h1>

          <p className="hero-in mt-7 text-lg max-w-md leading-relaxed" style={{ color: "var(--dim)", animationDelay: "240ms" }}>
            Priyadharsan Jayaseelan. Computer science at Kent State, testing secure software for federal clients.
          </p>

          <p className="hero-in mt-4 text-base flex flex-wrap items-baseline gap-x-2" style={{ color: "var(--dim)", animationDelay: "320ms" }}>
            <span>Right now:</span>
            <span className="text-white"><Typewriter /></span>
          </p>

          <div className="hero-in flex flex-wrap items-center gap-3 mt-10" style={{ animationDelay: "420ms" }}>
            <a href="#work" className="btn-primary">See my work</a>
            <button onClick={openStoryModal} className="btn-ghost">Play my story</button>
            <button onClick={openEmailPicker} className="btn-ghost">Email me</button>
            <span className="flex items-center gap-1 ml-1">
              <a href="https://github.com/PriyadharsanJayaseelan" target="_blank" rel="noreferrer" className="icon-link" aria-label="GitHub"><IconGitHub /></a>
              <a href="https://www.linkedin.com/in/priyadharsan-jayaseelan/" target="_blank" rel="noreferrer" className="icon-link" aria-label="LinkedIn"><IconLinkedIn /></a>
            </span>
          </div>
        </div>

        {/* ── Holo stage ── */}
        <div
          ref={videoRef}
          className="relative w-full aspect-square max-w-[640px] mx-auto lg:mr-0"
          style={{ willChange: "transform" }}
        >
          <HoloCrystal targets={panelRefs} className="absolute inset-0" />
          <div aria-hidden className="hud-scan" />

          {/* panels: absolutely placed around the crystal on desktop */}
          <Panel panelRef={panelRefs[0]} delay={700} title="Test framework" status="Passing"
            className="hidden lg:block absolute left-0 top-[4%] w-[188px]">
            <div className="hud-big">51 <span>cases</span></div>
            <div className="hud-sub">22 in the regression suite</div>
          </Panel>
          <Panel panelRef={panelRefs[1]} delay={900} title="RBAC audit" status="Fixed"
            className="hidden lg:block absolute right-0 top-[10%] w-[196px]">
            <div className="hud-sub text-white/90">Privilege escalation found in report metadata</div>
            <div className="hud-meter mt-2.5"><span style={{ width: "100%" }} /></div>
          </Panel>
          <Panel panelRef={panelRefs[2]} delay={1100} title="AI assistant QA" status="Verified"
            className="hidden lg:block absolute left-[2%] bottom-[8%] w-[200px]">
            <div className="hud-big">80+ <span>questions</span></div>
            <Bars />
          </Panel>
          <Panel panelRef={panelRefs[3]} delay={1300} title="Operations" status="Live"
            className="hidden lg:block absolute right-0 bottom-[16%] w-[188px]">
            <div className="hud-big">200+ <span>staff</span></div>
            <div className="hud-sub">30% fewer no-shows</div>
            <div className="hud-meter mt-2"><span style={{ width: "70%" }} /></div>
          </Panel>
        </div>

        {/* panels as a grid on phones and tablets */}
        <div className="lg:hidden grid grid-cols-2 gap-3 -mt-4">
          <Panel delay={500} title="Test framework" status="Passing">
            <div className="hud-big">51 <span>cases</span></div>
            <div className="hud-sub">22 in regression</div>
          </Panel>
          <Panel delay={600} title="RBAC audit" status="Fixed">
            <div className="hud-sub text-white/90">Privilege escalation caught</div>
          </Panel>
          <Panel delay={700} title="AI assistant QA" status="Verified">
            <div className="hud-big">80+ <span>checks</span></div>
          </Panel>
          <Panel delay={800} title="Operations" status="Live">
            <div className="hud-big">200+ <span>staff</span></div>
          </Panel>
        </div>
      </div>
    </section>
  );
}
