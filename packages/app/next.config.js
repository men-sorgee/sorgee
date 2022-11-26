const { PHASE_DEVELOPMENT_SERVER } = require( 'next/constants' )
module.exports = ( phase, { defaultConfig } ) => {
  const dev = PHASE_DEVELOPMENT_SERVER === phase
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    //...defaultConfig,
    // Append the default value with md extensions
    pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
    publicRuntimeConfig: {
      dev,
      title: "Guys in Heat",
      description: "Denver's social events for bi, married and discrete men.",
      baseUrl: dev ? 'http://localhost:3000' : 'https://guysnheat.com',
      adminUrl: 'https://admin.guysnheat.com'
    },
    serverRuntimeConfig: {
      adminToken: process.env.ADMIN_TOKEN || '',
    },
    images: {
      domains: ['guysnheat.com', 'admin.guysnheat.com', 'localhost', 'lh3.googleusercontent.com', 'cdn.discordapp.com', 's.gravatar.com'],
    },
    async redirects() {
      return [
        {
          source: '/invite',
          destination: '/member/invite',
          permanent: true,
        },
      ]
    },
    poweredByHeader: false,
  }
  return nextConfig
}
