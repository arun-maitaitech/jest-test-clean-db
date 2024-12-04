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

let dsOptions_basePath: string;
if (process.env.TYPEORM_DS_OPTIONS_PATH) {
  dsOptions_basePath = path.resolve(process.cwd(), process.env.TYPEORM_DS_OPTIONS_PATH);
} else {
  throw new Error(`Env variable 'TYPEORM_DS_OPTIONS_PATH' is missing or invalid value, please make sure it have a valid value`);
}

const dsOptions_configPath = path.resolve(dsOptions_basePath, 'dsOptions_config.js');
let dsOptionsImported: IImported_DS_Options;

try {
  dsOptionsImported = require(dsOptions_configPath).dsOptions;
} catch (error) {
  throw new Error(`Unable to load DS options config file, Please make sure that the file exists: ${dsOptions_configPath}, Error:${error}`);
}

const DEFAULT_PORT = 5432;

export const baseDataSourceOptions: PostgresConnectionOptions = {
  ...dsOptionsImported,

  host: process.env.TEST_POSTGRESQL_HOSTNAME || '',
  username: process.env.TEST_POSTGRESQL_USERNAME || '',
  password: process.env.TEST_POSTGRESQL_PASSWORD || '',
  port: DEFAULT_PORT,

  // database: // Missing on purpose!
};
