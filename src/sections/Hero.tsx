import Typewriter from "../components/Typewriter";
import { openEmailPicker } from "../components/EmailPicker";
import { useHeroParallax } from "../hooks/useHeroParallax";

export default function Hero() {
  const { videoRef, lineLeftRef, lineRightRef, badgeRef, bodyRef } =
    useHeroParallax();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* ── Video background (zooms slightly on scroll) ── */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ willChange: "transform", transformOrigin: "center center" }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/Priyadharsan_Jayaseelan/video.mp4" type="video/mp4" />
      </video>

      {/* ── Gradient overlay ── */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,26,51,0.45) 0%, rgba(0,26,51,0.15) 40%, rgba(0,26,51,0.72) 100%)",
        }}
      />

      {/* ── Ambient glow orbs ── */}
      <div
        className="absolute z-[2] rounded-full animate-glow-pulse animate-float"
        style={{
          width: "480px",
          height: "480px",
          top: "10%",
          left: "-8%",
          background:
            "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute z-[2] rounded-full animate-glow-pulse animate-float-slow"
        style={{
          width: "360px",
          height: "360px",
          top: "20%",
          right: "-4%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)",
          filter: "blur(50px)",
          animationDelay: "2s",
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute z-[2] rounded-full animate-glow-pulse"
        style={{
          width: "260px",
          height: "260px",
          bottom: "20%",
          left: "40%",
          background:
            "radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
          animationDelay: "1s",
          pointerEvents: "none",
        }}
      />

      {/* ── Hero Content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-28 pb-40">
        {/* Status badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 text-xs tracking-widest mb-6 animate-fade-rise"
          style={{ color: "hsl(240,4%,66%)", willChange: "opacity" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
            style={{
              background: "#4ade80",
              boxShadow: "0 0 8px #4ade80",
            }}
          />
          AVAILABLE FOR PROJECTS
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-7xl md:text-8xl font-normal max-w-5xl animate-fade-rise-delay"
          style={{
            fontFamily: "'Instrument Serif', serif",
            lineHeight: "0.95",
            letterSpacing: "-2.46px",
            color: "#fff",
          }}
        >
          <span
            ref={lineLeftRef}
            className="inline-block"
            style={{ willChange: "transform, opacity" }}
          >
            Building systems that{" "}
            <em className="not-italic" style={{ color: "hsl(240,4%,66%)" }}>
              solve
            </em>
          </span>{" "}
          <span
            ref={lineRightRef}
            className="inline-block"
            style={{ willChange: "transform, opacity" }}
          >
            real{" "}
            <em className="not-italic" style={{ color: "hsl(240,4%,66%)" }}>
              problems.
            </em>
          </span>
        </h1>

        {/* Body group (sinks + fades on scroll) */}
        <div
          ref={bodyRef}
          className="flex flex-col items-center"
          style={{ willChange: "transform, opacity" }}
        >
        {/* Sub */}
        <p
          className="text-xl sm:text-2xl max-w-xl mt-8 animate-fade-rise-delay-2"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            color: "hsl(240,4%,85%)",
            lineHeight: 1.3,
          }}
        >
          CS student by transcript.
        </p>
        <p
          className="text-base sm:text-lg max-w-xl mt-3 leading-relaxed animate-fade-rise-delay-2"
          style={{ color: "hsl(240,4%,66%)" }}
        >
          In practice: quality gate for federal AI systems, frontend engineer
          for a startup, and operations lead for 250+ people.
          Kent State University.
        </p>

        {/* Typewriter role */}
        <p
          className="text-sm sm:text-base animate-fade-rise-delay-2 mt-2"
          style={{ color: "hsl(240,4%,82%)", fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
        >
          <Typewriter />
        </p>

        {/* Link row */}
        <div className="flex flex-wrap gap-4 justify-center mt-10 animate-fade-rise-delay-3">
          <button
            onClick={openEmailPicker}
            className="liquid-glass rounded-full px-8 py-3 text-sm text-white cursor-pointer transition-transform duration-200 hover:scale-[1.04]"
            style={{ fontFamily: "inherit" }}
          >
            Get In Touch →
          </button>
          <a
            href="https://github.com/PriyadharsanJayaseelan"
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-8 py-3 text-sm no-underline transition-all duration-200 hover:scale-[1.04] border"
            style={{
              color: "hsl(240,4%,66%)",
              borderColor: "rgba(255,255,255,0.12)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#fff";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "hsl(240,4%,66%)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.12)";
            }}
          >
            GitHub ↗
          </a>
          <a
            href="https://www.linkedin.com/in/priyadharsan-jayaseelan/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-8 py-3 text-sm no-underline transition-all duration-200 hover:scale-[1.04] border"
            style={{
              color: "hsl(240,4%,66%)",
              borderColor: "rgba(255,255,255,0.12)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#fff";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "hsl(240,4%,66%)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.12)";
            }}
          >
            LinkedIn ↗
          </a>
          <a
            href="https://priyadharsanjayaseelan.github.io/Priyadharsan_Jayaseelan/story.html"
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-8 py-3 text-sm no-underline transition-all duration-200 hover:scale-[1.04] border"
            style={{
              color: "hsl(240,4%,66%)",
              borderColor: "rgba(255,255,255,0.12)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#fff";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "hsl(240,4%,66%)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.12)";
            }}
          >
            My Story ✦
          </a>
        </div>

        {/* CTA scroll */}
        <a
          href="#about"
          className="liquid-glass rounded-full px-14 py-5 text-base text-white no-underline mt-12 cursor-pointer transition-transform duration-200 hover:scale-[1.04] animate-fade-rise-delay-3"
        >
          Explore Work ↓
        </a>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-rise-delay-3">
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: "hsl(240,4%,45%)" }}
        >
          Scroll
        </span>
        <svg
          className="animate-bounce-down"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M8 3v10M3 9l5 5 5-5"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
