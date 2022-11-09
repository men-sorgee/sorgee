// const { PHASE_DEVELOPMENT_SERVER } = require( 'next/constants' )

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  // Append the default value with md extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],

  publicRuntimeConfig: {
    // Will be available on both server and client
    basePath: process.env.BASE_PATH || ''

  }
}


// Plugins
//const withMDX = require( '@next/mdx' )( {
//  extension: /\.mdx?$/,
//  options: {
//    remarkPlugins: [],
//    rehypePlugins: [],
//    // providerImportSource: "@mdx-js/react",
//  },
//} )

//module.exports = withMDX( nextConfig )



