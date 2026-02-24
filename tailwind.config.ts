import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b1020",
        accent: "#0ea5e9",
        surge: "#f97316",
        mist: "#e2e8f0"
      },
      fontFamily: {
        sans: ["'Space Grotesk'", "sans-serif"],
        display: ["'Bebas Neue'", "sans-serif"]
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at 25% 20%, rgba(14,165,233,0.2), transparent 50%), radial-gradient(circle at 80% 0%, rgba(249,115,22,0.16), transparent 40%)"
      },
      animation: {
        "fade-in": "fadeIn .45s ease-out",
        "rise-up": "riseUp .45s ease-out"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        riseUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
