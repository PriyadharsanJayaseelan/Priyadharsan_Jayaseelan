import Navbar from "../components/Navbar";

interface HeroProps {
  scrolled: boolean;
}

export default function Hero({ scrolled }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* ── Video background ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        {/* Place your video.mp4 in the /public folder */}
        <source src="/video.mp4" type="video/mp4" />
      </video>

      {/* ── Overlay ── */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,26,51,0.35) 0%, rgba(0,26,51,0.15) 50%, rgba(0,26,51,0.65) 100%)",
        }}
      />

      {/* ── Nav ── */}
      <div className="relative z-10">
        <Navbar scrolled={scrolled} />
      </div>

      {/* ── Hero Content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-8 pb-40">
        {/* Status badge */}
        <div
          className="inline-flex items-center gap-2 text-xs tracking-widest mb-6 animate-fade-rise"
          style={{ color: "hsl(240,4%,66%)" }}
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
          Building systems that{" "}
          <em
            className="not-italic"
            style={{ color: "hsl(240,4%,66%)" }}
          >
            solve
          </em>{" "}
          real{" "}
          <em
            className="not-italic"
            style={{ color: "hsl(240,4%,66%)" }}
          >
            problems.
          </em>
        </h1>

        {/* Sub */}
        <p
          className="text-base sm:text-lg max-w-xl mt-8 leading-relaxed animate-fade-rise-delay-2"
          style={{ color: "hsl(240,4%,66%)" }}
        >
          ML Engineer & CS Researcher. From ML pipelines to databases — I build
          things that actually matter. Kent State University · GPA 3.7
        </p>

        {/* Link row */}
        <div className="flex flex-wrap gap-4 justify-center mt-10 animate-fade-rise-delay-3">
          <a
            href="mailto:priyadharsanjayaseelan@gmail.com"
            className="liquid-glass rounded-full px-8 py-3 text-sm text-white no-underline transition-transform duration-200 hover:scale-[1.03]"
          >
            Get In Touch →
          </a>
          <a
            href="https://github.com/PriyadharsanJayaseelan"
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-8 py-3 text-sm no-underline transition-all duration-200 hover:scale-[1.03] border"
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
              (e.currentTarget as HTMLElement).style.color =
                "hsl(240,4%,66%)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.12)";
            }}
          >
            GitHub ↗
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-8 py-3 text-sm no-underline transition-all duration-200 hover:scale-[1.03] border"
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
              (e.currentTarget as HTMLElement).style.color =
                "hsl(240,4%,66%)";
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
            className="rounded-full px-8 py-3 text-sm no-underline transition-all duration-200 hover:scale-[1.03] border"
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
              (e.currentTarget as HTMLElement).style.color =
                "hsl(240,4%,66%)";
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
          className="liquid-glass rounded-full px-14 py-5 text-base text-white no-underline mt-12 cursor-pointer transition-transform duration-200 hover:scale-[1.03] animate-fade-rise-delay-3"
        >
          Explore Work ↓
        </a>
      </div>
    </section>
  );
}