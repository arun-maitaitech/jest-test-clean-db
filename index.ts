import { DataSource, DataSourceOptions } from "typeorm";
import utils from './src/utils/utils';

async function main() {
  const LOCATION_OF_MIGRATION_JS_FILES = '';
  const DEFAULT_PORT = 5432;

  let dsOptions: DataSourceOptions = {
    type: 'postgres',
    entities: [
    ],
    migrations: [LOCATION_OF_MIGRATION_JS_FILES],
    migrationsRun: false,
    logging: utils.isReallyTrue(process.env.POSTGRESQL_DEBUGGING),
    // schema: options?.schema || DEFAULT_SCHEMA,
    // dropSchema,
    synchronize: false,
    // extra: {
    //   connectionLimit: utils.isProd() ? 10 : 5,
    // },
  };

  const dbConfigFromEnvParams_test = {
    host: process.env.TEST_POSTGRESQL_HOSTNAME,
    username: process.env.TEST_POSTGRESQL_USERNAME,
    password: process.env.TEST_POSTGRESQL_PASSWORD,
    database: process.env.TEST_POSTGRESQL_DB_NAME,
  };

  const selected_dbConfigFromEnvParams = dbConfigFromEnvParams_test;

  const dataSource = new DataSource({
    ...dsOptions,
    ...selected_dbConfigFromEnvParams,
    port: DEFAULT_PORT,
  });

  const fn = `TypeORM (${selected_dbConfigFromEnvParams.username || 'undefined'}@${selected_dbConfigFromEnvParams.host || 'undefined'
    }/${selected_dbConfigFromEnvParams.database || 'undefined'})`;

  try {
    if (!dataSource.isInitialized) {
      utils.consoleLog(`${fn} - Connecting...`);
      await dataSource.initialize();
      utils.consoleLog(`${fn} - Connected!`);
    }
    // if (isCleanDB) {
    //   await dataSource.runMigrations();
    //   isCleanDB = false;
    // }

    // await dataSource.createQueryRunner("my_new_database");

  } catch (err) {
    utils.consoleError(`${fn} - ${(err)}`);
    throw err;
  }
}

main();