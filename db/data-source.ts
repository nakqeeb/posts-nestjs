/* eslint-disable @typescript-eslint/no-var-requires */
import { DataSource, DataSourceOptions } from 'typeorm';

/* const dotenv = require('dotenv');
const parsed = dotenv.config({ path: '.env.production' }); */
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  migrationsRun: true,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
