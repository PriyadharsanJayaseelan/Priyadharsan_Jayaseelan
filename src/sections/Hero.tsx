import Typewriter from "../components/Typewriter";
import BlackHole from "../components/BlackHole";
import { openEmailPicker } from "../components/EmailPicker";
import { openStoryModal } from "../components/StoryModal";
import { useHeroParallax } from "../hooks/useHeroParallax";

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

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-black">
      {/* Gargantua */}
      <div ref={videoRef} className="absolute inset-0" style={{ willChange: "transform" }}>
        <BlackHole className="absolute inset-0" />
      </div>
      <div aria-hidden className="hero-shade absolute inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 min-h-screen flex flex-col justify-end pb-20 sm:pb-24 pt-32">
        <div ref={bodyRef} className="max-w-2xl" style={{ willChange: "transform, opacity" }}>
          <div ref={badgeRef} className="hero-in term-line mb-6">
            <span className="text-[var(--gold)]">$</span> whoami
          </div>

          <h1 className="hero-in title-wide text-[1.45rem] leading-[1.2] sm:text-5xl lg:text-6xl text-white" style={{ animationDelay: "150ms" }}>
            Priyadharsan<br />Jayaseelan
          </h1>

          <p className="hero-in mt-7 text-xl sm:text-2xl text-white/90 leading-snug" style={{ animationDelay: "300ms" }}>
            I find the bugs before your users do.
          </p>
          <p className="hero-in mt-3 text-base leading-relaxed max-w-lg" style={{ color: "var(--dim)", animationDelay: "380ms" }}>
            Computer science at Kent State. Testing secure software for federal clients.
          </p>

          <p className="hero-in mt-6 term-line flex flex-wrap gap-x-2" style={{ animationDelay: "460ms" }}>
            <span style={{ color: "var(--dim)" }}>status:</span>
            <span className="text-white"><Typewriter /></span>
          </p>

          <div className="hero-in flex flex-wrap items-center gap-3 mt-10" style={{ animationDelay: "560ms" }}>
            <button onClick={openStoryModal} className="btn-primary">Play my story</button>
            <a href="#work" className="btn-ghost">See my work</a>
            <button onClick={openEmailPicker} className="btn-ghost">Email me</button>
            <span className="flex items-center gap-1 ml-1">
              <a href="https://github.com/PriyadharsanJayaseelan" target="_blank" rel="noreferrer" className="icon-link" aria-label="GitHub"><IconGitHub /></a>
              <a href="https://www.linkedin.com/in/priyadharsan-jayaseelan/" target="_blank" rel="noreferrer" className="icon-link" aria-label="LinkedIn"><IconLinkedIn /></a>
            </span>
          </div>
        </div>
      </div>

    </section>
  );
}
