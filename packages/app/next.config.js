const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')


module.exports = (phase, defaultConfig) =>  {
  const isDev = PHASE_DEVELOPMENT_SERVER === phase
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: isDev,
  })
  
  const withPWA = require('next-pwa')({
    dest: 'public',
    disable: isDev
  })

  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    publicRuntimeConfig: {
      dev: isDev
    },
    pageExtensions: ['tsx'],
    //experimental: { appDir: false, },
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
    poweredByHeader: true,
    crossOrigin: 'use-credentials'
  }
  return  withPWA(withBundleAnalyzer(nextConfig))
}


