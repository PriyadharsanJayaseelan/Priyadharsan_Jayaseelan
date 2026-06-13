export default function Contact() {
  return (
    <>
      <section
        id="contact"
        className="px-8 py-32 text-center max-w-7xl mx-auto"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Label */}
        <div
          className="scroll-reveal inline-flex items-center gap-3 text-xs tracking-widest uppercase mb-6"
          style={{ color: "hsl(240,4%,50%)" }}
        >
          Let's Connect
        </div>

        {/* Title */}
        <h2
          className="scroll-reveal reveal-delay-1 text-5xl md:text-6xl font-normal text-white mb-5"
          style={{
            fontFamily: "'Instrument Serif', serif",
            letterSpacing: "-0.02em",
          }}
        >
          Got something{" "}
          <em className="not-italic" style={{ color: "hsl(240,4%,66%)" }}>
            interesting?
          </em>
        </h2>

        <p
          className="scroll-reveal reveal-delay-2 text-base mb-12 max-w-sm mx-auto leading-relaxed"
          style={{ color: "hsl(240,4%,62%)" }}
        >
          Actively looking for internships, research roles, and cool projects.
          My inbox is always open.
        </p>

        {/* Email */}
        <a
          href="mailto:priyadharsanjayaseelan@gmail.com"
          className="scroll-reveal reveal-delay-3 no-underline transition-all duration-200 inline-block"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(1rem, 2vw, 1.4rem)",
            color: "#fff",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            paddingBottom: "4px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderBottomColor =
              "rgba(255,255,255,0.6)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderBottomColor =
              "rgba(255,255,255,0.2)";
          }}
        >
          priyadharsanjayaseelan@gmail.com
        </a>

        {/* Links */}
        <div className="scroll-reveal reveal-delay-4 flex flex-wrap gap-4 justify-center mt-10">
          {[
            {
              label: "GitHub ↗",
              href: "https://github.com/PriyadharsanJayaseelan",
            },
            { label: "LinkedIn ↗", href: "https://www.linkedin.com/in/priyadharsan-jayaseelan/" },
            {
              label: "My Story ✦",
              href: "https://priyadharsanjayaseelan.github.io/Priyadharsan_Jayaseelan/story.html",
            },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="no-underline rounded-full px-6 py-2.5 text-sm transition-all duration-200"
              style={{
                color: "hsl(240,4%,62%)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#fff";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "hsl(240,4%,62%)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,255,255,0.1)";
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>

      <footer
        className="text-center py-8 text-xs"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          color: "hsl(240,4%,38%)",
        }}
      >
        © 2026 Priyadharsan Jayaseelan · Built with precision.
      </footer>
    </>
  );
}
