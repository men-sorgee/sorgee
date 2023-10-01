const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')


//const withPWA = require('next-pwa')({
//  dest: 'public',
//  disable: process.env.PWA !== 'true'
//})


/// @type {import('next').NextConfig}
const getConfig = (phase) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    pageExtensions: ['tsx'],
    images: {
      domains: [
        'guysnheat.com',
        'admin.guysnheat.com',
        'localhost',
        'lh3.googleusercontent.com',
        'cdn.discordapp.com',
        's.gravatar.com',
        'static.guysnheat.com',
        'raw.githubusercontent.com',
        'guysnheat.whereby.com'
      ]
    },
    redirects: async () => {
      return [
        {
          source: '/:path*',
          has: [{ type: 'host', value: 'www.guysnheat.com' }],
          destination: 'https://guysnheat.com/:path*',
          permanent: true
        }
      ]
    },
    poweredByHeader: false,
  }
  return nextConfig
}

module.exports = getConfig // withPWA(getConfig)
