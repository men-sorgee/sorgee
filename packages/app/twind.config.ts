import { Configuration, warn, apply } from "twind";
import * as colors from "twind/colors";

const config: Configuration = {
  // Twind configuration: https://twind.dev/handbook/configuration.html
  mode: warn,
  theme: {
    extend: {
      screens: {
        standalone: { raw: "(display-mode:standalone)" },
      },
      fontFamily: {
        sans: ["Exo", "sans-serif"],
        serif: ["Crete Round", "serif"],
        mono: ["Consolas"],
      },
      colors: {
        ...colors,
        purple: {
          DEFAULT: "#7C3AED",
          "50": "#ECE2FC",
          "100": "#DFD0FB",
          "200": "#C7AAF7",
          "300": "#AE85F4",
          "400": "#955FF0",
          "500": "#7C3AED",
          "600": "#5D14DB",
          "700": "#470FA7",
          "800": "#320B74",
          "900": "#1C0641",
        },
        green: {
          DEFAULT: "#70C030",
          "50": "#D1EEBA",
          "100": "#C6EAAA",
          "200": "#B0E189",
          "300": "#9BD968",
          "400": "#85D148",
          "500": "#70C030",
          "600": "#569325",
          "700": "#3C661A",
          "800": "#21390E",
          "900": "#070C03",
        },
      },
    },
  },
  preflight: (preflight, { theme }) => ({
    ...preflight,
    "@import":
      'url("https://fonts.googleapis.com/css2?family=Crete+Round&family=Exo:wght@400;500;600;700&display=swap")',
    html: {
      touchAction: "manipulation",
      fontFeatureSettings: `'case' 1, 'rlig' 1, 'calt' 0'`,
      "@apply": "text-base font-sans",
    },
    body: {
      textRendering: "optimizeLegibility",
      MozOsxFontSmoothing: "grayscale",
      "@apply":
        "text-lg font-sans min-h-full m-0 relative text-white bg-black antialiased font-sans",
    },
    p: {
      WebkitTapHighlightColor: "white",
      "@apply": "my-4 text-base text-justify sm:text-left md:text-center  ",
    },
  }),

};

export default config;
