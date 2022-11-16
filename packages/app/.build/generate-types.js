#!/usr/bin/env node

const { existsSync, rmSync, mkdirSync, writeFileSync } = require( "fs" )
const { resolve } = require( "path" )

const { snakeCase, capitalCase } = require( "change-case" )
const { default: fetch } = require( "node-fetch" )

const host = "https://admin.guysnheat.com"
const outputDir = resolve( process.cwd(), "./lib/services/directus" )



async function getSpec() {
  const request = await fetch( `${ host }/server/specs/oas?access_token=${ "hd6Ge9Je438eb-lhOO4cCganj2Em1Z9i" }` )
  return await request.json()
}

async function main() {

  const spec = await getSpec()


  writeFileSync(
    `${ outputDir }/api.spec.json`,
    JSON.stringify( spec, null, 2 ),
    {
      encoding: `utf-8`
    }
  )

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
      return `  ${ propertyKey }: ItemsHandler<${ collectionType }>;`
    } )
    .filter( ( line ) => typeof line === `string` )
    .join( `\n` )

  const exportSource = `export type Collections = {\n${ exportProperties }\n};`

  const source = [baseSource, ...exportTypes, exportSource].join( `\n` )

  writeFileSync( `${ outputDir }/types.d.ts`, source, {
    encoding: `utf-8`,
  } )
}

main().catch( console.error ).finally( () => process.exit( 0 ) )
