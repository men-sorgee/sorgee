const { PHASE_DEVELOPMENT_SERVER } = require( 'next/constants' );
const withPWA = require( 'next-pwa' )( {
  dest: 'public'
} );


const getConfig = ( phase ) => {
  const dev = PHASE_DEVELOPMENT_SERVER === phase;
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    publicRuntimeConfig: {
      dev
    },
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
      ],

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
          destination: '/members/invite',
          permanent: true
        },
        {
          source: '/member/account',
          destination: '/member/settings',
          permanent: false
        },
        {
          source: '/member/invites',
          destination: '/member/events',
          permanent: false
        },
        {
          source: '/api/admin/:path',
          destination: '/api/member/:path',
          permanent: true
        }
      ];
    },
    poweredByHeader: false

  };
  return nextConfig;
};

module.exports = withPWA( getConfig );
