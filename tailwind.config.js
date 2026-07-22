/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F5F0E6",
          50: "#FBF8F1",
          100: "#F5F0E6",
          200: "#EFE8D8",
          300: "#E5DCC6",
        },
        ink: {
          DEFAULT: "#2A2622",
          soft: "#4A433B",
          muted: "#6B6358",
          faint: "#9A9088",
        },
        clay: {
          DEFAULT: "#B5651D",
          light: "#C77B58",
          dark: "#94501A",
        },
        sage: {
          DEFAULT: "#6B8E6B",
          light: "#8AA88A",
          dark: "#52704F",
        },
        line: "#E0D8C5",
      },
      fontFamily: {
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        sans: ['"DM Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        paper: "0 1px 2px rgba(42,38,34,0.04), 0 8px 24px -12px rgba(42,38,34,0.12)",
        "paper-lg":
          "0 2px 4px rgba(42,38,34,0.05), 0 20px 48px -20px rgba(42,38,34,0.18)",
        inset: "inset 0 0 0 1px rgba(42,38,34,0.06)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "draw-ring": {
          "0%": { strokeDashoffset: "var(--ring-circ)" },
          "100%": { strokeDashoffset: "var(--ring-end)" },
        },
        "grow-bar": {
          "0%": { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
