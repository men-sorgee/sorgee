#!/usr/bin/env node

import { promises, existsSync, rmSync, mkdirSync } from "fs";
import { resolve } from "path";
import openApiTs, { OpenAPI3 } from "openapi-typescript";

import { snakeCase } from "change-case";
import fetch from "node-fetch";

const host = "https://admin.guysnheat.com";
const outputDir = resolve(process.cwd(), "./packages/app/lib/directus");
if (existsSync(outputDir)) {
  rmSync(outputDir, { recursive: true });
}
mkdirSync(outputDir);

const spec = await (
  await fetch(
    `${host}/server/specs/oas?access_token=${"hd6Ge9Je438eb-lhOO4cCganj2Em1Z9i"}`,
    {
      method: `get`,
    }
  )
).json();

await promises.writeFile(
  `${outputDir}/api.spec.json`,
  JSON.stringify(spec, null, 2),
  {
    encoding: `utf-8`,
  }
);

const baseSource = await openApiTs(spec, { version: 3 });

const itemPattern = /^    Items([^\:]*)/;

const exportProperties = baseSource
  .split(`\n`)
  .map((line) => {
    const match = line.match(itemPattern);
    if (!match) {
      return null;
    }
    const [, collectionName] = match;
    const propertyKey = snakeCase(collectionName);
    return `  ${propertyKey}: components["schemas"]["Items${collectionName}"];`;
  })
  .filter((line) => typeof line === `string`)
  .join(`\n`);

const exportSource = `export type Directus = {\n${exportProperties}\n};`;

const source = [baseSource, exportSource].join(`\n`);

await promises.writeFile(`${outputDir}/types.d.ts`, source, {
  encoding: `utf-8`,
});
