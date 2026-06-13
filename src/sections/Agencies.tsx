const agencies = [
  {
    abbr: "VA",
    name: "Dept. of Veterans Affairs",
    color: "#003F72",
    logo: "/Priyadharsan_Jayaseelan/agencies/va.png",
  },
  {
    abbr: "DoD",
    name: "Dept. of Defense",
    color: "#003087",
    logo: "/Priyadharsan_Jayaseelan/agencies/dod.png",
  },
  {
    abbr: "Army",
    name: "U.S. Army",
    color: "#4B5320",
    logo: "/Priyadharsan_Jayaseelan/agencies/army.png",
  },
  {
    abbr: "USPTO",
    name: "Patent & Trademark Office",
    color: "#0F3D69",
    logo: "/Priyadharsan_Jayaseelan/agencies/uspto.png",
  },
  {
    abbr: "USDA",
    name: "Dept. of Agriculture",
    color: "#2C6E1A",
    logo: "/Priyadharsan_Jayaseelan/agencies/usda.png",
  },
  {
    abbr: "DLA",
    name: "Defense Logistics Agency",
    color: "#003366",
    logo: "/Priyadharsan_Jayaseelan/agencies/dla.png",
  },
  {
    abbr: "FDA",
    name: "Food & Drug Administration",
    color: "#1F4E97",
    logo: "/Priyadharsan_Jayaseelan/agencies/fda.png",
  },
  {
    abbr: "HHS",
    name: "Health & Human Services",
    color: "#00508C",
    logo: "/Priyadharsan_Jayaseelan/agencies/hhs.png",
  },
  {
    abbr: "HUD",
    name: "Housing & Urban Dev.",
    color: "#1C3F6E",
    logo: "/Priyadharsan_Jayaseelan/agencies/hud.png",
  },
  {
    abbr: "MD",
    name: "State of Maryland",
    color: "#8B0000",
    logo: "/Priyadharsan_Jayaseelan/agencies/maryland.png",
  },
];

function AgencyCard({ a }: { a: (typeof agencies)[0] }) {
  return (
    <div
      className="flex-shrink-0 flex flex-col items-center gap-3 px-6 py-5 rounded-2xl mx-3 transition-all duration-300 cursor-default"
      style={{
        background: `${a.color}22`,
        border: `1px solid ${a.color}66`,
        minWidth: "140px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = `${a.color}44`;
        (e.currentTarget as HTMLElement).style.borderColor = `${a.color}cc`;
        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = `${a.color}22`;
        (e.currentTarget as HTMLElement).style.borderColor = `${a.color}66`;
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      <img
        src={a.logo}
        alt={a.name}
        width={64}
        height={64}
        className="object-contain rounded-full"
        style={{ background: "rgba(255,255,255,0.06)", padding: "4px" }}
      />
      <div className="text-center">
        <div className="text-xs font-semibold text-white mb-0.5 tracking-wide">
          {a.abbr}
        </div>
        <div
          className="text-xs leading-tight text-center"
          style={{ color: "hsl(240,4%,58%)", maxWidth: "110px" }}
        >
          {a.name}
        </div>
      </div>
    </div>
  );
}

export default function Agencies() {
  const doubled = [...agencies, ...agencies];
  const reversed = [...agencies.slice(5), ...agencies.slice(0, 5)];
  const doubledReversed = [...reversed, ...reversed];

  return (
    <section className="py-24 max-w-7xl mx-auto px-8">
      {/* Label */}
      <div
        className="scroll-reveal flex items-center gap-3 text-xs tracking-widest uppercase mb-4"
        style={{ color: "hsl(240,4%,50%)" }}
      >
        Federal Agencies Served
        <span
          className="flex-1 h-px max-w-[80px]"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
      </div>

      <h2
        className="scroll-reveal reveal-delay-1 text-5xl md:text-6xl font-normal mb-4"
        style={{
          fontFamily: "'Instrument Serif', serif",
          letterSpacing: "-0.02em",
          lineHeight: "1.05",
        }}
      >
        Trusted by{" "}
        <em className="not-italic" style={{ color: "hsl(240,4%,66%)" }}>
          government.
        </em>
      </h2>

      <p
        className="scroll-reveal reveal-delay-2 text-base mb-14 max-w-xl"
        style={{ color: "hsl(240,4%,60%)" }}
      >
        Supporting federal modernization across defense, healthcare, agriculture,
        and civil agencies — via Supporting Effort's FAST Team.
      </p>

      {/* Carousel */}
      <div className="scroll-reveal reveal-delay-3 relative overflow-hidden">
        {/* Fade edges */}
        <div
          className="absolute inset-y-0 left-0 z-10 w-28 pointer-events-none"
          style={{
            background: "linear-gradient(to right, hsl(201,100%,13%), transparent)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 z-10 w-28 pointer-events-none"
          style={{
            background: "linear-gradient(to left, hsl(201,100%,13%), transparent)",
          }}
        />

        {/* Row 1 — left */}
        <div className="flex mb-4 animate-marquee" style={{ width: "max-content" }}>
          {doubled.map((a, i) => (
            <AgencyCard key={i} a={a} />
          ))}
        </div>

        {/* Row 2 — right (offset) */}
        <div className="flex animate-marquee-reverse" style={{ width: "max-content" }}>
          {doubledReversed.map((a, i) => (
            <AgencyCard key={i} a={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
