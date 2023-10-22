const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')


module.exports = (phase, defaultConfig) =>  {
  const isDev = PHASE_DEVELOPMENT_SERVER === phase
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  })
  
  const withPWA = require('next-pwa')({
    dest: 'public',
    disable: isDev
  })

  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    trailingSlash: false,
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
      if (isDev) return []
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
    crossOrigin: "anonymous",
    eslint: {
      ignoreDuringBuilds: process.env.SKIP === 'true',
    },
    
  }
  return  withPWA(withBundleAnalyzer(nextConfig))
}


