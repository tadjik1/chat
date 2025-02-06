import 'dotenv/config';

import { DataSource, DataSourceOptions } from 'typeorm';
import dbConfig from './config/database';

const dbOptions = dbConfig();

export default new DataSource({
  ...dbOptions,
  entities: ['**/*.entity.js'],
  migrations: ['migrations/*.js'],
} as DataSourceOptions);
