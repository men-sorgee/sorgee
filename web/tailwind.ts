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
    extend: {
      colors: {
        ...colors,
        accent: colors.blue
      }
    }
  }
};

export default config;
