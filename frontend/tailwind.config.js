/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        stadium: {
          bg: "#070b14",
          surface: "#121a2b",
          surfaceAlt: "#182238",
          border: "#232f4a",
          primary: "#22d3ee",
          primaryDark: "#0891b2",
          accent: "#a78bfa",
          success: "#34d399",
          warning: "#fbbf24",
          danger: "#f87171",
          pitch: "#0fdc7a",
          pitchDark: "#059e56",
          gold: "#ffc857",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Bebas Neue'", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(34, 211, 238, 0.15)",
        pitchGlow: "0 0 40px rgba(15, 220, 122, 0.25)",
        goldGlow: "0 0 30px rgba(255, 200, 87, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.35s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        blob: "blob 12s ease-in-out infinite",
        "blob-delay": "blob 12s ease-in-out infinite 4s",
        marquee: "marquee 22s linear infinite",
        float: "float 5s ease-in-out infinite",
        "spin-slow": "spin 14s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -40px) scale(1.1)" },
          "66%": { transform: "translate(-25px, 25px) scale(0.95)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
