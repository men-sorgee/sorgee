import { tw, css, apply } from 'twind/css';
import React from 'react';

const styles = tw(
  css({
    '&::before': { boxSizing: 'inherit' },
    '&::after': { boxSizing: 'inherit' },
    '*:focus': apply`outline-none ring-2 ring-pink-500 ring-opacity-50`,
    html: {
      touchAction: 'manipulation',
      fontFeatureSettings: `'case' 1, 'rlig' 1, 'calt' 0'`
    },
    body: {
      textRendering: 'optimizeLegibility',
      MozOsxFontSmoothing: 'grayscale',
      '@apply':
        'text-base min-h-full m-0 relative text-white bg-gray-500 antialiased'
    },
    a: {
      WebkitTapHighlightColor: 'black'
    }
  })
);

const GlobalStyles = () => (
  <>
    <style>${tw(styles)}</style>
  </>
);

export default GlobalStyles;
