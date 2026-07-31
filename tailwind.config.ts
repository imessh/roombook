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
        bg: "#F8FAFF",
        card: "#FFFFFF",
        ink: {
          900: "#111827",
          700: "#374151",
          500: "#6B7280",
          400: "#9CA3AF",
          300: "#CBD5E1",
        },
        brand: {
          DEFAULT: "#5B21B6",
          light: "#EEF2FF",
          dark: "#4C1D95",
        },
        category: {
          meeting: "#2563EB",
          meetingBg: "#DBEAFE",
          interview: "#8B5CF6",
          interviewBg: "#F3E8FF",
          training: "#F59E0B",
          trainingBg: "#FFFBEB",
          workshop: "#14B8A6",
          workshopBg: "#D1FAE5",
          other: "#EC4899",
          otherBg: "#FCE7F3",
        },
        line: "#E2E8F0",
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
