import { Configuration, strict } from 'twind';
import * as colors from 'twind/colors';

const config: Configuration = {
  // Twind configuration: https://twind.dev/handbook/configuration.html
  darkMode: 'class',
  mode: strict,
  theme: {
    fontFamily: {
      sans: ['Oswald', 'sans-serif'],
      serif: ['Crete Round', 'serif'],
      mono: ['Consolas']
    },
    colors: {
      violet: {
        DEFAULT: '#7C3AED',
        '50': '#ECE2FC',
        '100': '#DFD0FB',
        '200': '#C7AAF7',
        '300': '#AE85F4',
        '400': '#955FF0',
        '500': '#7C3AED',
        '600': '#5D14DB',
        '700': '#470FA7',
        '800': '#320B74',
        '900': '#1C0641'
      },
      green: {
        DEFAULT: '#70C030',
        '50': '#D1EEBA',
        '100': '#C6EAAA',
        '200': '#B0E189',
        '300': '#9BD968',
        '400': '#85D148',
        '500': '#70C030',
        '600': '#569325',
        '700': '#3C661A',
        '800': '#21390E',
        '900': '#070C03'
      }
    },
    extend: {
      colors: {
        ...colors,
        primary: colors.violet,
        accent: colors.green
      }
    }
  }
};

export default config;
