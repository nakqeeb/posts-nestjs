/* eslint-disable @typescript-eslint/no-var-requires */
import { DataSource, DataSourceOptions } from 'typeorm';

/* const dotenv = require('dotenv');
const parsed = dotenv.config({ path: '.env.production' }); */
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
