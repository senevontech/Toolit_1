/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neu: {
          bg:      "#e2e8f0",
          surface: "#edf1f7",
          dark:    "#d0d8e4",
        },
        orange: {
          50:  "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2440a",
          800: "#9a3412",
          900: "#7c2d12",
        },
      },
      boxShadow: {
        "neu-raised":
          "8px 8px 18px rgba(163,177,198,0.62), -8px -8px 18px rgba(255,255,255,0.92)",
        "neu-raised-sm":
          "5px 5px 10px rgba(163,177,198,0.58), -5px -5px 10px rgba(255,255,255,0.88)",
        "neu-flat":
          "4px 4px 8px rgba(163,177,198,0.50), -4px -4px 8px rgba(255,255,255,0.82)",
        "neu-inset":
          "inset 6px 6px 14px rgba(163,177,198,0.62), inset -6px -6px 14px rgba(255,255,255,0.88)",
        "neu-inset-sm":
          "inset 4px 4px 8px rgba(163,177,198,0.58), inset -4px -4px 8px rgba(255,255,255,0.84)",
        "orange-raised":
          "6px 6px 14px rgba(194,84,10,0.45), -3px -3px 8px rgba(255,180,100,0.50), inset 1px 1px 2px rgba(255,210,160,0.40)",
        "orange-raised-lg":
          "10px 10px 20px rgba(194,84,10,0.48), -4px -4px 10px rgba(255,180,100,0.52), inset 1px 1px 3px rgba(255,210,160,0.40)",
        "orange-inset":
          "inset 5px 5px 12px rgba(150,40,0,0.50), inset -3px -3px 8px rgba(255,160,80,0.28)",
      },
      backgroundImage: {
        "neu-gradient":     "linear-gradient(145deg, #edf1f7, #d5dce8)",
        "orange-metal":     "linear-gradient(145deg, #fb923c, #c2440a)",
        "silver-metal":     "linear-gradient(145deg, #f0f4f9, #d0d8e4)",
        "silver-metal-rev": "linear-gradient(145deg, #d0d8e4, #f0f4f9)",
      },
      keyframes: {
        springIn: {
          "0%":   { transform: "scale(0.94) translateY(2px)" },
          "60%":  { transform: "scale(1.03) translateY(-1px)" },
          "100%": { transform: "scale(1)    translateY(0)"    },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to:   { opacity: "1", transform: "translateY(0)"    },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center"  },
        },
      },
      animation: {
        "spring-in": "springIn 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "fade-up":   "fadeUp 0.5s ease both",
        "shimmer":   "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
}
