const { PHASE_DEVELOPMENT_SERVER } = require( 'next/constants' )
const withTM = require( 'next-transpile-modules' )( ['react-daisyui'] )

const getConfig = ( phase ) => {
  const dev = PHASE_DEVELOPMENT_SERVER === phase
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
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
      ]
    },
    poweredByHeader: false,
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      // ignoreDuringBuilds: true,
    },
    //webpack: ( config, { isServer } ) => {
    //  if ( !isServer ) {
    //    config.resolve.fallback.fs = false
    //  }
    //  config.module.rules.push( { test: /\.ya?ml$/, use: 'yaml-loader' } )
    //  //config.module.rules.push( { test: /\.gql?$/, loader: 'webpack-graphql-loader' } )
    //  return config
    //}
  }
  return nextConfig
}

module.exports = withTM( getConfig )
