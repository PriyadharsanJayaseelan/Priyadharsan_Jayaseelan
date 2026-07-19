import { useState } from "react";
import { openEmailPicker } from "./EmailPicker";

interface NavProps {
  scrolled: boolean;
}

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ scrolled }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "liquid-glass-nav" : ""
      }`}
    >
      <div className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        {/* Logo */}
        <a
          href="#hero"
          style={{ fontFamily: "'Instrument Serif', serif" }}
          className="text-2xl tracking-tight text-white no-underline"
        >
          PJ<sup className="text-xs">®</sup>
        </a>

        {/* Nav links — hidden on mobile */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm no-underline transition-colors duration-200"
              style={{ color: "hsl(240,4%,66%)" }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "#fff")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "hsl(240,4%,66%)")
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: CTA + hamburger */}
        <div className="flex items-center gap-4">
          <button
            onClick={openEmailPicker}
            className="hidden md:inline-block liquid-glass rounded-full px-6 py-2.5 text-sm text-white cursor-pointer transition-transform duration-200 hover:scale-[1.04]"
            style={{ fontFamily: "inherit" }}
          >
            Get In Touch
          </button>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block w-5 h-px bg-white transition-all duration-300"
              style={{
                transform: menuOpen
                  ? "translateY(6px) rotate(45deg)"
                  : "none",
              }}
            />
            <span
              className="block w-5 h-px bg-white transition-all duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-5 h-px bg-white transition-all duration-300"
              style={{
                transform: menuOpen
                  ? "translateY(-6px) rotate(-45deg)"
                  : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? "280px" : "0",
          background: "rgba(0,26,51,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: menuOpen ? "1px solid rgba(255,255,255,0.08)" : "none",
        }}
      >
        <div className="flex flex-col px-8 py-6 gap-5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm no-underline text-white"
              style={{ color: "hsl(240,4%,75%)" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              openEmailPicker();
            }}
            className="liquid-glass rounded-full px-6 py-2.5 text-sm text-white cursor-pointer text-center mt-2"
            style={{ fontFamily: "inherit" }}
          >
            Get In Touch
          </button>
        </div>
      </div>
    </nav>
  );
}
