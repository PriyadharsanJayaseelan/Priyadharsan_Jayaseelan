import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import Stats from "./sections/Stats";
import Projects from "./sections/Projects";
import Timeline from "./sections/Timeline";
import Certifications from "./sections/Certifications";
import Contact from "./sections/Contact";
import Marquee from "./components/Marquee";
import Divider from "./components/Divider";
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
    <div style={{ background: "hsl(201,100%,13%)", minHeight: "100vh" }}>
      {/* ── Fixed Navbar ── */}
      <Navbar scrolled={scrolled} />

      {/* ── Hero (video + headline) ── */}
      <Hero />

      {/* ── Marquee ticker ── */}
      <Marquee />

      {/* ── Stats / About ── */}
      <Stats />

      <Divider />

      {/* ── Projects ── */}
      <Projects />

      <Divider />

      {/* ── Timeline: Experience & Education ── */}
      <Timeline />

      <Divider />

      {/* ── Certifications ── */}
      <Certifications />

      {/* ── Contact + Footer ── */}
      <Contact />
    </div>
  );
}
