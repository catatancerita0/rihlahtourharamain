/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // 2 core colors (emerald, cream) + neutral shell + 1 accent (gold).
      // Gold fails AA as text on light surfaces (2.27:1), so it is only used as
      // a fill behind charcoal/emerald text or on emerald surfaces (5.14:1).
      colors: {
        emerald: {
          900: "#0B2F29",
          800: "#0F3D35",
          700: "#155446",
          600: "#1C6B57",
          500: "#2F7A67",
          400: "#6E8C84",
          300: "#9DBAB2",
          200: "#C4D6D1",
          100: "#DCE8E4",
          50: "#EDF3F1",
        },
        cream: {
          DEFAULT: "#F7F3EA",
          deep: "#F0EBDF",
        },
        shell: "#FCFBF7",
        charcoal: {
          DEFAULT: "#202522",
          soft: "#4C5A55",
          // 5.65:1 on the shell surface, so muted copy still clears AA.
          muted: "#5A6862",
        },
        gold: {
          DEFAULT: "#C9A45C",
          soft: "#E8D6AF",
        },
        status: {
          available: "#1F6B3A",
          limited: "#8A5A12",
          full: "#9E2B25",
          "available-dark": "#8FD3A8",
          "limited-dark": "#E8C77E",
          "full-dark": "#F2A8A2",
        },
      },
      fontFamily: {
        // Serif carries the editorial and spiritual register; the sans keeps
        // long-form Indonesian readable. Both chosen for character, not trend.
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      fontSize: {
        // Fluid scale: headings keep their editorial presence down to phones
        // instead of holding one desktop size.
        "display-xl": ["clamp(2.6rem, 7vw, 5.25rem)", { lineHeight: "1.02", letterSpacing: "-0.015em" }],
        "display-lg": ["clamp(2.1rem, 5vw, 3.6rem)", { lineHeight: "1.06", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(1.7rem, 3.6vw, 2.6rem)", { lineHeight: "1.12", letterSpacing: "-0.005em" }],
        "display-sm": ["clamp(1.35rem, 2.4vw, 1.8rem)", { lineHeight: "1.2" }],
        "body-lg": ["clamp(1.05rem, 1.4vw, 1.2rem)", { lineHeight: "1.68" }],
        body: ["1rem", { lineHeight: "1.7" }],
        "body-sm": ["0.9375rem", { lineHeight: "1.65" }],
        label: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.04em" }],
      },
      borderRadius: {
        // Variation is a hierarchy tool: inputs and buttons stay tight, cards
        // and panels open up, and only the motif medallion is a full circle.
        sm: "3px",
        md: "7px",
        lg: "12px",
        xl: "20px",
        panel: "28px",
      },
      boxShadow: {
        // Elevation marker only. Two elements use it: the finder panel that
        // overlaps the hero, and the sticky mobile CTA bar.
        panel: "0 18px 40px -24px rgba(11, 47, 41, 0.35)",
        overlay: "0 30px 60px -30px rgba(11, 47, 41, 0.45)",
      },
      maxWidth: {
        prose: "68ch",
        shell: "1180px",
      },
      spacing: {
        // Vertical rhythm steps. Section padding picks between them instead of
        // using one value everywhere.
        section: "clamp(3.5rem, 7vw, 6.5rem)",
        "section-lg": "clamp(4.5rem, 9vw, 8.5rem)",
        "section-sm": "clamp(2.5rem, 5vw, 4rem)",
      },
      transitionTimingFunction: {
        calm: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
