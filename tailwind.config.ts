import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand — sampled from the Figma export
        brand: {
          50: "#F5F9FD",
          100: "#E8EEFD",
          200: "#DBE7FB",
          300: "#BFD3F7",
          400: "#6C97F0",
          500: "#2462E8", // bright accent / primary button
          600: "#1D53CC",
          700: "#174195", // deep brand blue (headings, bands)
          800: "#163E8C",
          900: "#12326F",
          950: "#0C2350",
        },
        ink: {
          DEFAULT: "#0F1A2E", // near-black heading
          600: "#475569",
          500: "#64748B",
          400: "#94A3B8",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F8FAFC",
          sky: "#E1EBFA",
        },
        danger: "#DC2626",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        shell: "1200px",
      },
      borderRadius: {
        card: "16px",
        xl2: "20px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,26,46,0.04), 0 8px 24px rgba(15,26,46,0.06)",
        cardHover: "0 2px 4px rgba(15,26,46,0.06), 0 16px 40px rgba(15,26,46,0.10)",
        panel: "0 4px 12px rgba(15,26,46,0.05), 0 24px 60px rgba(15,26,46,0.10)",
        pill: "0 6px 16px rgba(36,98,232,0.28)",
        tilt: "0 6px 18px rgba(15,26,46,0.10)",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(.22,.61,.36,1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        gradientPan: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        floatY: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blob: {
          "0%,100%": {
            borderRadius: "58% 42% 47% 53% / 55% 46% 54% 45%",
            transform: "rotate(0deg) scale(1)",
          },
          "33%": {
            borderRadius: "46% 54% 57% 43% / 48% 56% 44% 52%",
            transform: "rotate(40deg) scale(1.07)",
          },
          "66%": {
            borderRadius: "52% 48% 42% 58% / 58% 44% 56% 46%",
            transform: "rotate(-30deg) scale(0.96)",
          },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        floatY: "floatY 6s ease-in-out infinite",
        fadeUp: "fadeUp .6s cubic-bezier(.22,.61,.36,1) both",
        blob: "blob 16s ease-in-out infinite",
        gradientPan: "gradientPan 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
