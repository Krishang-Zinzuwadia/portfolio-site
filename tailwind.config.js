/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        retro: {
          bg: "#c0c0c0",        // Standard Macintosh classic light grey
          borderLight: "#ffffff", // Light highlight border
          borderDark: "#808080",  // Dark shadow border
          borderDarkest: "#000000", // Retro black double borders
          activeHeader: "#000000",
          inactiveHeader: "#808080",
          desktop: "#55aaaa",   // System 7 default checkered teal
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        chicago: ["Chicago", "ChicagoPixel", "Chicago Pixel", "Geneva", "sans-serif"],
        geneva: ["Geneva", "sans-serif"],
        monaco: ["Monaco", "monospace"],
      },
      boxShadow: {
        retro: "1px 1px 0px #ffffff inset, -1px -1px 0px #808080 inset",
        retroActive: "1px 1px 0px #ffffff, -1px -1px 0px #808080",
        retroBezel: "inset 2px 2px 0px #ffffff, inset -2px -2px 0px #808080",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
