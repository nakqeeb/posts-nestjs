import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  //   type: 'sqlite',
  //   database: 'postsdb.sqlite',
  //   entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  // synchronize: true,
} as DataSourceOptions;

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dataSourceOptions, {
      type: 'sqlite',
      database: 'postsdb.sqlite',
      entities: ['dist/**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dataSourceOptions, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['dist/**/*.entity.ts'],
    });
    break;
  case 'production':
    Object.assign(dataSourceOptions, {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      migrationsRun: true,
      entities: ['dist/**/*.entity.js'],
      ssl: {
        rejectUnauthorized: false,
      },
    });
    break;
  default:
    // Object.assign(dbConfig, {
    //   type: 'postgres',
    //   url: parsed.parsed.DATABASE_URL,
    //   migrationsRun: true,
    //   entities: ['**/*.entity.js'],
    //   ssl: {
    //     rejectUnauthorized: false,
    //   },
    // });
    throw new Error('unknown environment');
}

//console.log(process.env.DATABASE_URL);

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
