/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#06070B",
        deepblack: "#0A0A0A",
        electric: {
          DEFAULT: "#007BA7",
          dim: "rgba(0, 123, 167, 0.15)",
          border: "rgba(0, 123, 167, 0.40)",
        },
        lavender: {
          DEFAULT: "#C9C2DC",
          highlight: "#E4DFEE",
          muted: "#8E88A8",
          border: "rgba(201, 194, 220, 0.12)",
          faint: "rgba(201, 194, 220, 0.04)",
        },
        status: {
          pass: {
            bg: "rgba(16, 185, 129, 0.12)",
            border: "rgba(16, 185, 129, 0.40)",
            text: "#34D399",
          },
          missing: {
            bg: "rgba(245, 158, 11, 0.12)",
            border: "rgba(245, 158, 11, 0.40)",
            text: "#FBBF24",
          },
          conflict: {
            bg: "rgba(168, 85, 247, 0.12)",
            border: "rgba(168, 85, 247, 0.40)",
            text: "#C084FC",
          },
          fail: {
            bg: "rgba(244, 63, 94, 0.12)",
            border: "rgba(244, 63, 94, 0.40)",
            text: "#FB7185",
          },
          unverified: {
            bg: "rgba(148, 163, 184, 0.12)",
            border: "rgba(148, 163, 184, 0.40)",
            text: "#94A3B8",
          },
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Consolas", "monospace"],
      },
      transitionTimingFunction: {
        'studio': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
