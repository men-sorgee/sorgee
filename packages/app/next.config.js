const { PHASE_DEVELOPMENT_SERVER } = require( 'next/constants' )
const withTM = require( 'next-transpile-modules' )( ['react-daisyui'] )

const getConfig = ( phase ) => {
  const dev = PHASE_DEVELOPMENT_SERVER === phase
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = withTM( {
    // Append the default value with md extensions
    pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
    publicRuntimeConfig: {
      dev,
      title: 'Guys in Heat',
      description: "Denver's social events for bi, married and discrete men.",
      baseUrl: dev ? 'http://localhost:3000' : 'https://guysnheat.com',
      adminUrl: 'https://admin.guysnheat.com'
    },
    serverRuntimeConfig: {
      adminToken: process.env.ADMIN_TOKEN || '',

    },
    images: {
      domains: [
        'guysnheat.com',
        'admin.guysnheat.com',
        'localhost',
        'lh3.googleusercontent.com',
        'cdn.discordapp.com',
        's.gravatar.com',
        'static.guysnheat.com'
      ]
    },
    async headers() {
      return [
        {
          // matching all API routes
          source: "/api/(.*)",
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "*" },
            {
              key: "Access-Control-Allow-Methods",
              value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
            },
            {
              key: "Access-Control-Allow-Headers",
              value:
                "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
            },
          ],
        },
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
        }
      ]
    },
    poweredByHeader: false
  } )
  return nextConfig
}

module.exports = getConfig
