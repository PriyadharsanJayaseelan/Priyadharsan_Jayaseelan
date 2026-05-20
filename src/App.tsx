import { useState, useEffect } from "react";
import Hero from "./sections/Hero";
import Stats from "./sections/Stats";
import Projects from "./sections/Projects";
import Timeline from "./sections/Timeline";
import Certifications from "./sections/Certifications";
import Contact from "./sections/Contact";
import Marquee from "./components/Marquee";
import Divider from "./components/Divider";

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ background: "hsl(201,100%,13%)", minHeight: "100vh" }}>
      {/* ── Hero (video + nav + headline) ── */}
      <Hero scrolled={scrolled} />

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