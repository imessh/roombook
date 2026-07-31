import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        bg: "#EEF0F7",
        card: "#FFFFFF",
        ink: {
          900: "#1B1E2B",
          700: "#31364A",
          500: "#6B7086",
          400: "#9199B0",
          300: "#B7BCCC",
        },
        brand: {
          DEFAULT: "#3E7BFA",
          light: "#E9F0FF",
          dark: "#2F62D4",
        },
        category: {
          meeting: "#3E7BFA",
          meetingBg: "#E9F0FF",
          interview: "#8B5CF6",
          interviewBg: "#F2EBFF",
          training: "#F2994A",
          trainingBg: "#FFF0E1",
          workshop: "#27AE60",
          workshopBg: "#E5F8EC",
          other: "#EC4899",
          otherBg: "#FDEAF3",
        },
        line: "#E7E9F2",
      },
      borderRadius: {
        xl2: "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(30, 34, 60, 0.05)",
        card: "0 10px 30px rgba(30, 34, 60, 0.06)",
        popover: "0 20px 45px rgba(30, 34, 60, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
