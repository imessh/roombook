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
        bg: "#F8F8FC",
        card: "#FFFFFF",
        ink: {
          900: "#1A1A1F",
          700: "#33333B",
          500: "#73737D",
          400: "#9A9AA4",
          300: "#C4C4CE",
        },
        brand: {
          DEFAULT: "#6366F1",
          light: "#EEF0FE",
          dark: "#4F52D6",
        },
        // Sidebar accent palette — each nav item gets its own color
        sidebar: {
          purple: "#8B5CF6",
          purpleBg: "#F1EBFE",
          blue: "#3B82F6",
          blueBg: "#E9F1FE",
          green: "#10B981",
          greenBg: "#E4F8F0",
          orange: "#F59E0B",
          orangeBg: "#FEF3E0",
          pink: "#EC4899",
          pinkBg: "#FDEAF3",
        },
        // Booking category palette — vivid, matches timeline blocks
        category: {
          meeting: "#6366F1",
          meetingBg: "#EEF0FE",
          interview: "#10B981",
          interviewBg: "#E4F8F0",
          training: "#F59E0B",
          trainingBg: "#FEF3E0",
          workshop: "#EC4899",
          workshopBg: "#FDEAF3",
          other: "#EF4444",
          otherBg: "#FEEBEB",
        },
        line: "#ECECF4",
      },
      borderRadius: {
        xl2: "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(26, 26, 31, 0.06)",
        card: "0 20px 40px rgba(26, 26, 31, 0.08)",
        popover: "0 24px 60px rgba(26, 26, 31, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
