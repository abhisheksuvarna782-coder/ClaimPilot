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
          light: "#00A3E0",
          glow: "#00C2FF",
          dark: "#005370",
          dim: "#003244",
        },
        lavender: {
          DEFAULT: "#C9C2DC",
          light: "#EAE7F2",
          dim: "#8E88A8",
          dark: "#5A5473",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "Inter", "sans-serif"],
        heading: ["Orbitron", "Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Consolas", "monospace"],
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(0, 123, 167, 0.35)',
        'glow-md': '0 0 20px rgba(0, 123, 167, 0.45)',
        'glow-lg': '0 0 35px rgba(0, 123, 167, 0.55)',
        'glow-cyan': '0 0 25px rgba(0, 194, 255, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'equalizer': 'equalize 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        equalize: {
          '0%': { height: '15%' },
          '50%': { height: '90%' },
          '100%': { height: '35%' },
        }
      }
    },
  },
  plugins: [],
}
