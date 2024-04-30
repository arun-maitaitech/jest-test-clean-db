import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const distFolder = __dirname;
const LOCATION_OF_MIGRATION_JS_FILES = distFolder + '/src/db/migrations/**/*.{js,ts}';
// console.log('LOCATION_OF_MIGRATION_JS_FILES=' + LOCATION_OF_MIGRATION_JS_FILES)
const DEFAULT_PORT = 5432;

export const baseDataSourceOptions: PostgresConnectionOptions = {
  type: 'postgres',
  entities: [],
  migrations: [LOCATION_OF_MIGRATION_JS_FILES],
  migrationsRun: false,
  logging: Boolean(process.env.POSTGRESQL_DEBUGGING),
  // schema: options?.schema || DEFAULT_SCHEMA,
  // dropSchema,
  synchronize: false,
  // extra: {
  //   connectionLimit: utils.isProd() ? 10 : 5,
  // },
  host: process.env.TEST_POSTGRESQL_HOSTNAME || '',
  username: process.env.TEST_POSTGRESQL_USERNAME || '',
  password: process.env.TEST_POSTGRESQL_PASSWORD || '',
  port: DEFAULT_PORT,

  // database: // Missing on purpose!
};
