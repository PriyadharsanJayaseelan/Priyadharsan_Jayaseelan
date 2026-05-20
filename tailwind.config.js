/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Instrument Serif'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      colors: {
        navy: "hsl(201, 100%, 13%)",
        muted: "hsl(240, 4%, 66%)",
        border: "rgba(255,255,255,0.08)",
      },
      animation: {
        "fade-rise": "fade-rise 0.8s ease-out both",
        "fade-rise-1": "fade-rise 0.8s ease-out 0.2s both",
        "fade-rise-2": "fade-rise 0.8s ease-out 0.4s both",
        "fade-rise-3": "fade-rise 0.8s ease-out 0.6s both",
        marquee: "marquee 30s linear infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
      keyframes: {
        "fade-rise": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
    },
  },
  plugins: [],
};