import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Inception parchment palette
        paper: {
          DEFAULT: "#f7f1de",
          soft: "#f3ebd0",
          line: "#e6dcb8",
        },
        ink: "#0a1628",
        "ink-soft": "#1a2942",
        "ink-mute": "#5a6478",
        "ink-faint": "#8a8f9e",
        dac: {
          red: "#d94c1f",
          orange: "#e76b2c",
          yellow: "#f5c842",
          green: "#2ea043",
          blue: "#1f4287",
          cream: "#fdf6e3",
        },
      },
      backgroundImage: {
        "grid-paper":
          "linear-gradient(rgba(10,22,40,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(10,22,40,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        sys: "0.1em",
      },
      animation: {
        "fade-in": "fadeIn .3s ease-out",
        "blink": "blink 1.4s steps(2) infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
