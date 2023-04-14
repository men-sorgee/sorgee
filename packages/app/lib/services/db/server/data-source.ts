import 'reflect-metadata'
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm'
import gnhDBConfig from '../ormconfig'

const AppDataSource = new DataSource(gnhDBConfig)

let initialized = false

export async function getRepository<T = ObjectLiteral>(type: EntityTarget<T>) {
  if (!initialized) {
    await AppDataSource.initialize()
    initialized = true
  }
  return AppDataSource.getRepository<T>(type)
}
