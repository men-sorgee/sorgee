const { PHASE_DEVELOPMENT_SERVER } = require( 'next/constants' );

const getConfig = ( phase ) => {
  const dev = PHASE_DEVELOPMENT_SERVER === phase;
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    pageExtensions: ['ts', 'tsx'],
    images: {
      domains: [
        'guysnheat.com',
        'admin.guysnheat.com',
        'localhost',
        'lh3.googleusercontent.com',
        'cdn.discordapp.com',
        's.gravatar.com',
        'static.guysnheat.com',
        'raw.githubusercontent.com'

      ]
    },
    async redirects() {
      return [
        {
          source: '/:path*',
          has: [{ type: 'host', value: 'www.guysnheat.com' }],
          destination: 'https://guysnheat.com/:path*',
          permanent: true
        },
        {
          source: '/invite',
          destination: '/member/invite',
          permanent: true
        },
        {
          source: '/api/admin/:path',
          destination: '/api/member/:path',
          permanent: true
        }
      ];
    },
    poweredByHeader: false,
  };
  return nextConfig;
};

module.exports = getConfig;
