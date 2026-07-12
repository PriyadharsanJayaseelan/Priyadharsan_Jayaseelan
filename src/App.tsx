import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import Hero from "./sections/Hero";
import Stats from "./sections/Stats";
import Projects from "./sections/Projects";
import Timeline from "./sections/Timeline";
import Certifications from "./sections/Certifications";
import Contact from "./sections/Contact";
import Marquee from "./components/Marquee";
import Divider from "./components/Divider";
import Agencies from "./sections/Agencies";
import { useScrollReveal } from "./hooks/useScrollReveal";

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useScrollReveal();

  return (
    <div
      style={{ background: "hsl(201,100%,13%)", minHeight: "100vh", position: "relative" }}
    >
      {/* ── Grain texture overlay ── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          pointerEvents: "none",
          opacity: 0.032,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── Scroll progress bar ── */}
      <ScrollProgress />

      {/* ── Fixed Navbar ── */}
      <Navbar scrolled={scrolled} />

      {/* ── Hero ── */}
      <Hero />

      {/* ── Marquee ticker ── */}
      <Marquee />

      {/* ── Stats / About ── */}
      <Stats />

      <Divider />

      {/* ── Federal Agencies ── */}
      <Agencies />

      <Divider />

      {/* ── Projects ── */}
      <Projects />

      <Divider />

      {/* ── Timeline ── */}
      <Timeline />

      <Divider />

      {/* ── Certifications ── */}
      <Certifications />

      {/* ── Contact + Footer ── */}
      <Contact />

      {/* ── Back to top ── */}
      <BackToTop />
    </div>
  );
}
