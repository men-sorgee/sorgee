#!/usr/bin/env node
require( 'dotenv' ).config( {
  path: '.env.local'
} )

const API_KEY = process.env.ADMIN_TOKEN
const ADMIN_URL = process.env.ADMIN_URL

const { writeFileSync } = require( "fs" )
const { resolve } = require( "path" )

const { snakeCase, capitalCase } = require( "change-case" )
const { default: fetch } = require( "node-fetch" )
const outputDir = resolve( process.cwd(), "./models" )


async function main() {
  const request = await fetch( `${ ADMIN_URL }/server/specs/oas?access_token=${ API_KEY }` )
  const spec = await request.json()

  const { default: openApiTs } = await import( "openapi-typescript" )
  const baseSource = await openApiTs( spec, { version: 3 } )

  const itemPattern = /^    Items([^\:]*)/
  const exportTypes = []
  const exportProperties = baseSource
    .split( `\n` )
    .map( ( line ) => {
      const match = line.match( itemPattern )
      if ( !match ) {
        return null
      }
      const [, collectionName] = match
      const collectionType = capitalCase( collectionName )
        .split( ' ' )
        .map( ( word ) => word.replace( /s$/g, '' ) )
        .join( '' )
      const propertyKey = snakeCase( collectionName )
      exportTypes.push( `export type ${ collectionType } = components["schemas"]["Items${ collectionName }"];` )

      return `  ${ propertyKey }: ${ collectionType };`
    } )
    .filter( ( line ) => typeof line === `string` )
    .concat( [
      `  collections: components["schemas"]["Collections"];`,
      `  fields: components["schemas"]["Fields"];`,
      `  files: components["schemas"]["Files"];`,
      `  folders: components["schemas"]["Folders"];`
    ] )
    .join( `\n` )

  const exportSource = `export type Collections = {\n${ exportProperties }\n};`

  const source = [baseSource, ...exportTypes, exportSource].join( `\n` )

  writeFileSync( `${ outputDir }/directus.ts`, source, {
    encoding: `utf-8`,
  } )
}

console.log( 'Generating Directus API types... ' )

main().catch( console.error )
  .then( () => console.log( 'Done Generating Types' ) )
  .finally( () => process.exit( 0 ) )
