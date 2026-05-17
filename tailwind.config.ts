import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cocoa: "#3D2B26",
        blush: "#FCDDD8",
        salmon: "#F2AFA3",
        peachy: "#E8C5BC",
        tan: "#C0A090",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        display: ["var(--font-cormorant)"],
        body: ["var(--font-dm-sans)"],
      },
      boxShadow: {
        'card': '0 8px 32px rgba(61,43,38,0.15)',
      },
      borderRadius: {
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
};
export default config;
