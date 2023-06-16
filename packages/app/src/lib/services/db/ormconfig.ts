import { DataSourceOptions } from 'typeorm'

import * as types from './entities'

const config: DataSourceOptions = {
  name: 'gnh',
  type: 'postgres',
  host: process.env.DB_HOST || '35.223.87.210',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER || 'guysnheat',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'guysnheat',
  synchronize: false,
  entities: types,
  useUTC: true,
  poolSize: 10,
}

export default config
