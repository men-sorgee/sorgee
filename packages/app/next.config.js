const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.PWA !== 'true'
})

const getConfig = (phase) => {
  const dev = PHASE_DEVELOPMENT_SERVER === phase

  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    publicRuntimeConfig: {
      dev,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY
    },
    pageExtensions: ['tsx'],
    experimental: { appDir: false },
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
    crossOrigin: false
  }
  return nextConfig
}

module.exports = withPWA(getConfig)
