/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        gothic: ['"DotGothic16"', '"ZCOOL KuaiLe"', "sans-serif"],
        zcool: ['"ZCOOL KuaiLe"', "sans-serif"],
      },
      colors: {
        // 背景色：深紫到深蓝
        bgdeep: "#1a0b2e",
        bgdark: "#0d1b3e",
        bgmid: "#241449",
        // 主撞色
        magenta: "#d946ef",
        sky2: "#38bdf8",
        amber2: "#f59e0b",
        yellow2: "#fbbf24",
        // 状态色
        good: "#22c55e",
        bad: "#ef4444",
        // 像素描边暗色
        ink: "#0f0716",
        cream: "#fef3c7",
      },
      boxShadow: {
        pixel: "4px 4px 0 0 #0f0716",
        "pixel-sm": "2px 2px 0 0 #0f0716",
        "pixel-lg": "6px 6px 0 0 #0f0716",
        "pixel-inset": "inset 2px 2px 0 0 rgba(255,255,255,0.25), inset -2px -2px 0 0 rgba(0,0,0,0.35)",
      },
      keyframes: {
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        wiggle: {
          "0%,100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        flashGood: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(34,197,94,0)" },
          "50%": { boxShadow: "0 0 0 8px rgba(34,197,94,0.65)" },
        },
        flashBad: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(239,68,68,0)" },
          "50%": { boxShadow: "0 0 0 8px rgba(239,68,68,0.65)" },
        },
        popIn: {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "70%": { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        twinkle: {
          "0%,100%": { opacity: "0.25", transform: "scale(0.85)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        barFill: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "spin-slow": "spinSlow 6s linear infinite",
        floaty: "floaty 3s ease-in-out infinite",
        wiggle: "wiggle 2.4s ease-in-out infinite",
        "flash-good": "flashGood 0.5s ease-out 2",
        "flash-bad": "flashBad 0.5s ease-out 2",
        "pop-in": "popIn 0.35s cubic-bezier(.18,1.4,.4,1) both",
        twinkle: "twinkle 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
