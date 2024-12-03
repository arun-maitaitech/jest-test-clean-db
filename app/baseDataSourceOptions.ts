import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

type IImported_DS_Options = {
  type: 'postgres';
  entities: string[];
  migrations: string[];
  migrationsRun: boolean;
  logging: boolean;
  synchronize: boolean;
}

const distWithSrcPath = path.resolve(process.cwd(), 'dist', 'src', 'db');
const dsOptions_configPath = path.resolve(distWithSrcPath, 'dsOptions_config.js');
let dsOptionsImported: IImported_DS_Options;

try {
  dsOptionsImported = require(dsOptions_configPath).dsOptions;
} catch (error) {
  throw new Error(`Error: Please make sure that the file exists: ${dsOptions_configPath}`);
}

const distFolder = __dirname;
const LOCATION_OF_MIGRATION_JS_FILES = distFolder + '/src/db/migrations/**/*.{js,ts}';
// consoleDebug('LOCATION_OF_MIGRATION_JS_FILES=' + LOCATION_OF_MIGRATION_JS_FILES)
const DEFAULT_PORT = 5432;

export const baseDataSourceOptions: PostgresConnectionOptions = {
  ...dsOptionsImported,

  host: process.env.TEST_POSTGRESQL_HOSTNAME || '',
  username: process.env.TEST_POSTGRESQL_USERNAME || '',
  password: process.env.TEST_POSTGRESQL_PASSWORD || '',
  port: DEFAULT_PORT,

  // database: // Missing on purpose!
};
