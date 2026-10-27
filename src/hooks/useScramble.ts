import { useEffect } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

/** Scrambles each section `h2` into place the first time it scrolls into view. */
export function useScramble() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scramble = (el: HTMLElement) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes: { node: Text; text: string }[] = [];
      while (walker.nextNode()) {
        const node = walker.currentNode as Text;
        if (node.textContent?.trim()) nodes.push({ node, text: node.textContent });
      }
      const total = nodes.reduce((n, t) => n + t.text.length, 0);
      const start = performance.now();
      const dur = 700 + total * 12;

      const frame = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        let offset = 0;
        for (const { node, text } of nodes) {
          node.textContent = text
            .split("")
            .map((ch, i) => {
              if (ch === " ") return " ";
              const reveal = (offset + i) / total;
              return p >= reveal ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join("");
          offset += text.length;
        }
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            io.unobserve(e.target);
            setTimeout(() => scramble(e.target as HTMLElement), 120);
          }
        }
      },
      { threshold: 0.6 }
    );
    document.querySelectorAll<HTMLElement>("section:not(#hero) h2").forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, []);
}
