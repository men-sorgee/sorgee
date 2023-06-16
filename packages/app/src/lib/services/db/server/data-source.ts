import 'reflect-metadata'

import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm'

import gnhDBConfig from '../ormconfig'

const AppDataSource = new DataSource(gnhDBConfig)

let initialized = false
let beingInitialized = false
export async function getRepository<T = ObjectLiteral>(type: EntityTarget<T>) {
  while (beingInitialized) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  if (initialized == false) {
    beingInitialized = true
    await AppDataSource.initialize().then(() => {
      initialized = true
      beingInitialized = false
    })
  }
  while (!AppDataSource.isInitialized) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  return AppDataSource.getRepository<T>(type)
}
