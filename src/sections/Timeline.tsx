const timeline = [
  {
    num: "01",
    category: "Experience · Current",
    title: "Software QA Engineer Intern",
    org: "Pivotal ITS · Federal Advanced Solutions Team (FAST) · May 2026 – Aug 2026",
    detail:
      "Supporting federal clients including the VA/VHA, DoD and GSA. Designed a 51-case test framework and 22-case regression suite for a secure, role-based intranet portal and AI reporting assistant, with traceability from user story to UAT. Caught a critical privilege-escalation defect where report metadata changes bypassed RBAC clearance checks. Built a proof-of-concept Copilot Studio agent whose SharePoint + Entra ID pattern was adopted for production, and an 80+ question validation suite for the AI assistant.",
  },
  {
    num: "02",
    category: "Experience",
    title: "Software Developer Intern",
    org: "StreetStashed · Fashion & Lifestyle Delivery Platform · Jan 2026 – Mar 2026",
    detail:
      "Root-caused a marketplace search failure to component state that never synced with URL parameters, and built a useSearchParams/useEffect sync layer in React/Next.js to restore search. Fixed two more defects (filters not applying, state resetting on refresh) so filtered links are shareable. Fixed broken image placeholders on every product page with error-safe fallbacks and lazy loading.",
  },
  {
    num: "03",
    category: "Leadership",
    title: "Lead Student Operations Coordinator",
    org: "Kent State University · Aug 2024 – Present",
    detail:
      "Manage scheduling for 200+ student employees in When to Work, cutting no-shows by 30% with automated text reminders through Simple Texting. Configured threshold-based stock alerts in CBORD, cutting stockouts by 25% and excess inventory costs by 10%.",
  },
  {
    num: "04",
    category: "Project",
    title: "RollCall · ROTC Attendance Platform",
    org: "Streamlit · MongoDB · Fall 2025",
    detail:
      "Built the Event Management module from a blank file and resolved 4 reviewer-flagged issues across two PR cycles. Replaced a hardcoded schedule with a database-backed settings page with role-based access for four roles. Designed the SVG logo and wrote the full README.",
  },
  {
    num: "05",
    category: "Research",
    title: "VR IV Needle Insertion Usability Study",
    org: "Research Assistant · Kent State University · Spring 2025",
    detail:
      "Ran VR and haptic IV insertion simulations for 50+ biotech students across 100+ attempts each. Cleaned 5,000+ raw responses into trial-range datasets and computed SUS and NASA-TLX scores that showed learning-curve trends and informed the training redesign.",
  },
  {
    num: "06",
    category: "Education",
    title: "Kent State University",
    org: "B.S. Computer Science · Minor in Data Analytics · GPA 3.5 · Expected May 2027",
    detail:
      "Alpha Lambda Delta National Honor Society (2024) · Global Scholarship. Coursework: Data Structures, Database Management, Software Engineering, Big Data Analytics.",
  },
];

export default function Timeline() {
  return (
    <section className="px-8 py-32 max-w-7xl mx-auto">
      {/* Label */}
      <div
        className="scroll-reveal flex items-center gap-3 text-xs tracking-widest uppercase mb-4"
        style={{ color: "hsl(240,4%,50%)" }}
      >
        The Journey
        <span
          className="flex-1 h-px max-w-[80px]"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
      </div>

      {/* Title */}
      <h2
        className="scroll-reveal reveal-delay-1 text-5xl md:text-6xl font-normal mb-20"
        style={{
          fontFamily: "'Instrument Serif', serif",
          letterSpacing: "-0.02em",
          lineHeight: "1.05",
        }}
      >
        Experience &{" "}
        <em className="not-italic" style={{ color: "hsl(240,4%,66%)" }}>
          Education.
        </em>
      </h2>

      {/* Timeline */}
      <div className="flex flex-col">
        {timeline.map((item, i) => (
          <div
            key={item.num}
            className={`scroll-reveal reveal-delay-${Math.min(i + 1, 5)} grid gap-8 pb-14`}
            style={{ gridTemplateColumns: "64px 1px 1fr" }}
          >
            {/* Number */}
            <div
              className="text-xs tracking-wider text-right pt-1"
              style={{ color: "hsl(240,4%,50%)" }}
            >
              {item.num}
            </div>

            {/* Line + dot */}
            <div className="relative flex justify-center">
              <div
                className="absolute top-1.5 w-2.5 h-2.5 rounded-full"
                style={{
                  border: "1px solid rgba(255,255,255,0.35)",
                  background: "hsl(201,100%,13%)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  boxShadow: "0 0 8px rgba(255,255,255,0.1)",
                }}
              />
              {i < timeline.length - 1 && (
                <div
                  className="w-px h-full"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.03))",
                  }}
                />
              )}
            </div>

            {/* Body */}
            <div className="pb-2">
              <div
                className="text-xs tracking-widest uppercase mb-2"
                style={{ color: "hsl(240,4%,50%)" }}
              >
                {item.category}
              </div>
              <div
                className="text-2xl font-normal text-white mb-1"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {item.title}
              </div>
              <div className="text-sm mb-3" style={{ color: "hsl(240,4%,62%)" }}>
                {item.org}
              </div>
              <div
                className="text-sm leading-relaxed max-w-lg"
                style={{ color: "hsl(240,4%,50%)" }}
              >
                {item.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
