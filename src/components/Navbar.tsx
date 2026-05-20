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
  return (
    <nav
      className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto"
      style={{
        transition: "all 0.3s",
      }}
    >
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

      {/* CTA */}
      <a
        href="mailto:priyadharsanjayaseelan@gmail.com"
        className="liquid-glass rounded-full px-6 py-2.5 text-sm text-white no-underline transition-transform duration-200 hover:scale-[1.03]"
      >
        Get In Touch
      </a>
    </nav>
  );
}