import { Configuration, warn } from "twind";
import * as colors from "twind/colors";

const config: Configuration = {
  // Twind configuration: https://twind.dev/handbook/configuration.html
  darkMode: "class",
  mode: warn,
  theme: {
    fontFamily: {
      sans: ["Oswald", "sans-serif"],
      serif: ["Crete Round", "serif"],
      mono: ["Consolas"],
    },
    colors,
    extend: {
      colors: {
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
  preflight: {
    ":global": {
      html: {
        touchAction: "manipulation",
        fontFeatureSettings: `'case' 1, 'rlig' 1, 'calt' 0'`,
      },
      body: {
        textRendering: "optimizeLegibility",
        MozOsxFontSmoothing: "grayscale",
      },
      p: {
        WebkitTapHighlightColor: "white",
      },

      // @ts-ignore
      [[".tooltip-arrow", ".tooltip-arrow:before"]]: {
        position: "absolute",
        width: "8px",
        height: "8px",
        background: "inherit",
      },
      [".tooltip-arrow"]: {
        visibility: "hidden",
      },
      [".tooltip-arrow:before"]: {
        content: '""',
        visibility: "visible",
        transform: "rotate(45deg)",
      },
      [`[data-tooltip-style^='light'] + .tooltip > .tooltip-arrow:before`]: {
        "border-style": "solid",
        "border-color": colors.gray[200],
      },
      [`[data-tooltip-style^='light'] + .tooltip[data-popper-placement^='top'] > .tooltip-arrow:before`]:
        {
          "border-bottom-width": "1px",
          "border-right-width": "1px",
        },
      [`[data-tooltip-style^='light'] + .tooltip[data-popper-placement^='right'] > .tooltip-arrow:before`]:
        {
          "border-bottom-width": "1px",
          "border-left-width": "1px",
        },
      [`[data-tooltip-style^='light'] + .tooltip[data-popper-placement^='bottom'] > .tooltip-arrow:before`]:
        {
          "border-top-width": "1px",
          "border-left-width": "1px",
        },
      [`[data-tooltip-style^='light'] + .tooltip[data-popper-placement^='left'] > .tooltip-arrow:before`]:
        {
          "border-top-width": "1px",
          "border-right-width": "1px",
        },
      [`.tooltip[data-popper-placement^='top'] > .tooltip-arrow`]: {
        bottom: "-4px",
      },
      [`.tooltip[data-popper-placement^='bottom'] > .tooltip-arrow`]: {
        top: "-4px",
      },
      [`.tooltip[data-popper-placement^='left'] > .tooltip-arrow`]: {
        right: "-4px",
      },
      [`.tooltip[data-popper-placement^='right'] > .tooltip-arrow`]: {
        left: "-4px",
      },
      [".tooltip.invisible > .tooltip-arrow:before"]: {
        visibility: "hidden",
      },
      // @ts-ignore
      [["[data-popper-arrow]", "[data-popper-arrow]:before"]]: {
        position: "absolute",
        width: "8px",
        height: "8px",
        background: "inherit",
      },
      ["[data-popper-arrow]"]: {
        visibility: "hidden",
      },
      ["[data-popper-arrow]:before"]: {
        content: '""',
        visibility: "visible",
        transform: "rotate(45deg)",
      },
      ["[data-popper-arrow]:after"]: {
        content: '""',
        visibility: "visible",
        transform: "rotate(45deg)",
        position: "absolute",
        width: "9px",
        height: "9px",
        background: "inherit",
      },
      [`[role='tooltip'] > [data-popper-arrow]:before`]: {
        "border-style": "solid",
        "border-color": colors.gray[600],
      },
      [`[role='tooltip'] > [data-popper-arrow]:after`]: {
        "border-style": "solid",
        "border-color": colors.gray[600],
      },
      [`[data-popover][role='tooltip'][data-popper-placement^='top'] > [data-popper-arrow]:before`]:
        {
          "border-bottom-width": "1px",
          "border-right-width": "1px",
        },
      [`[data-popover][role='tooltip'][data-popper-placement^='top'] > [data-popper-arrow]:after`]:
        {
          "border-bottom-width": "1px",
          "border-right-width": "1px",
        },
      [`[data-popover][role='tooltip'][data-popper-placement^='right'] > [data-popper-arrow]:before`]:
        {
          "border-bottom-width": "1px",
          "border-left-width": "1px",
        },
      [`[data-popover][role='tooltip'][data-popper-placement^='right'] > [data-popper-arrow]:after`]:
        {
          "border-bottom-width": "1px",
          "border-left-width": "1px",
        },
      [`[data-popover][role='tooltip'][data-popper-placement^='bottom'] > [data-popper-arrow]:before`]:
        {
          "border-top-width": "1px",
          "border-left-width": "1px",
        },
      [`[data-popover][role='tooltip'][data-popper-placement^='bottom'] > [data-popper-arrow]:after`]:
        {
          "border-top-width": "1px",
          "border-left-width": "1px",
        },
      [`[data-popover][role='tooltip'][data-popper-placement^='left'] > [data-popper-arrow]:before`]:
        {
          "border-top-width": "1px",
          "border-right-width": "1px",
        },
      [`[data-popover][role='tooltip'][data-popper-placement^='left'] > [data-popper-arrow]:after`]:
        {
          "border-top-width": "1px",
          "border-right-width": "1px",
        },
      [`[data-popover][role='tooltip'][data-popper-placement^='top'] > [data-popper-arrow]`]:
        {
          bottom: "-5px",
        },
      [`[data-popover][role='tooltip'][data-popper-placement^='bottom'] > [data-popper-arrow]`]:
        {
          top: "-5px",
        },
      [`[data-popover][role='tooltip'][data-popper-placement^='left'] > [data-popper-arrow]`]:
        {
          right: "-5px",
        },
      [`[data-popover][role='tooltip'][data-popper-placement^='right'] > [data-popper-arrow]`]:
        {
          left: "-5px",
        },
      [`[role='tooltip'].invisible > [data-popper-arrow]:before`]: {
        visibility: "hidden",
      },
      [`[role='tooltip'].invisible > [data-popper-arrow]:after`]: {
        visibility: "hidden",
      },
    },
  },

  plugins: {
    custom: {
      ".tooltip": {},
      "tooltip-arrow": {},
      ".dark": {},
    },
  },
};

export default config;
