export default function Certifications() {
  return (
    <section className="px-8 py-32 max-w-7xl mx-auto">
      {/* Label */}
      <div
        className="scroll-reveal flex items-center gap-3 text-xs tracking-widest uppercase mb-4"
        style={{ color: "hsl(240,4%,50%)" }}
      >
        Certifications
        <span
          className="flex-1 h-px max-w-[80px]"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
      </div>

      {/* Title */}
      <h2
        className="scroll-reveal reveal-delay-1 text-5xl md:text-6xl font-normal mb-16"
        style={{
          fontFamily: "'Instrument Serif', serif",
          letterSpacing: "-0.02em",
          lineHeight: "1.05",
        }}
      >
        Verified{" "}
        <em className="not-italic" style={{ color: "hsl(240,4%,66%)" }}>
          Credentials.
        </em>
      </h2>

      {/* Cert card */}
      <div
        className="scroll-reveal reveal-delay-2 card-glow shimmer-top rounded-[20px] p-10 max-w-3xl"
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div className="flex gap-8 items-start">
          {/* Content */}
          <div className="flex-1">
            <div
              className="text-xs tracking-widest uppercase mb-3"
              style={{ color: "hsl(240,4%,55%)" }}
            >
              Kent State University · Information Services
            </div>

            <h3
              className="text-3xl font-normal text-white mb-2"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              PCI Essentials for Account Data Handlers
            </h3>

            <p className="text-sm mb-3" style={{ color: "hsl(240,4%,62%)" }}>
              PCI DSS 4.0 · PCI-101-CS-02 · 2025
            </p>

            <p
              className="text-xs font-mono mb-4"
              style={{ color: "hsl(240,4%,45%)" }}
            >
              ID: PJ6597539281020250 84536KP
            </p>

            {/* Active badge */}
            <div
              className="inline-flex items-center gap-2 text-xs mb-6"
              style={{ color: "#4ade80" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
                style={{
                  background: "#4ade80",
                  boxShadow: "0 0 8px #4ade80",
                }}
              />
              ACTIVE · Oct 28, 2025
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                "Data Security",
                "PCI DSS 4.0",
                "Compliance",
                "Account Data Handling",
                "Risk Management",
              ].map((t) => (
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

            <a
              href="#"
              className="liquid-glass rounded-full px-5 py-2 text-xs text-white no-underline transition-transform duration-200 hover:scale-[1.04] inline-block"
            >
              View Certificate ↗
            </a>
          </div>

          {/* Badge */}
          <div className="liquid-glass rounded-xl p-5 text-center min-w-[100px] hidden sm:block">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-xs font-medium text-white mb-1">KSU</div>
            <div
              className="text-xs tracking-wider"
              style={{ color: "hsl(240,4%,55%)" }}
            >
              Verified
            </div>
          </div>
        </div>
      </div>

      {/* What this means */}
      <div
        className="scroll-reveal reveal-delay-3 mt-8 p-6 rounded-xl max-w-3xl"
        style={{
          border: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        <div
          className="text-xs tracking-widest uppercase mb-2"
          style={{ color: "hsl(240,4%,50%)" }}
        >
          What This Means
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "hsl(240,4%,65%)" }}
        >
          Certified in Payment Card Industry Data Security Standards, the global
          standard for protecting cardholder data and managing secure payment
          systems.
        </p>
      </div>
    </section>
  );
}
