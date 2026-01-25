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
                primary: "#C27BA0", // Dusty Terracotta / Pink
                secondary: "#FFFDD0", // Rich Cream
                "secondary-dim": "#F9F6F2",
                accent: "#2C3E36", // Deep Charcoal
                "accent-gray": "#4A4A4A",
            },
            fontFamily: {
                serif: ["var(--font-playfair)", "serif"],
                sans: ["var(--font-figtree)", "sans-serif"], // Updated to Figtree
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            borderRadius: {
                xl: "0.75rem", // rounded-xl default
                "2xl": "1rem",
            },
            boxShadow: {
                "sm": "0 1px 2px rgba(0,0,0,0.05)",
                "md": "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                "lg": "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                "xl": "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                "2xl": "0 25px 50px -12px rgba(0,0,0,0.25)",
            },
        },
    },
    plugins: [],
};
export default config;
