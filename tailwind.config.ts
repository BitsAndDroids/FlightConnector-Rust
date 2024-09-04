import type { Config } from "tailwindcss";

const config: Config = {
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "z-[1]",
    "z-[2]",
    "z-[3]",
    "z-[4]",
    "z-[5]",
    "z-[6]",
    "z-[7]",
    "z-[8]",
    "z-[9]",
  ],
  theme: {
    extend: {
      colors: {
        "bitsanddroids-blue": "#0f4c5c",
        "bitsanddroids-blue-light": "#21aace",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
