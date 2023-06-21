import { DataSource, DataSourceOptions } from "typeorm";
import utils from './src/utils/utils';
import { createDatabase } from "typeorm-extension";

async function sleepPromise(milliseconds: number): Promise<void> {
  return new Promise((resolve, reject) => {
    // utils.consoleLog(new Date().toISOString()+' - sleeping');

    setTimeout(() => {
      // utils.consoleLog(new Date().toISOString()+' - woke up');
      resolve();
    }, milliseconds || 200);
  });
}
async function createNewDbOrThrow(dataSource: DataSource, dbName: string) {

  const result = await dataSource.query(
    `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`
  );

  if (result.length) {
    throw new Error(`A DB with the name ${dbName} already exists!`);
  } else {
    console.log(`Creating database with name "${dbName}"`);
    await dataSource.query(`CREATE DATABASE "${dbName}"`);
  }
}

async function duplicateDbOrThrow(dataSource: DataSource, newDbName: string, templateDbName: string) {

  const result = await dataSource.query(
    `SELECT 1 FROM pg_database WHERE datname = '${newDbName}'`
  );

  if (result.length) {
    throw new Error(`A DB with the name ${newDbName} already exists!`);
  } else {
    console.log(`Creating database with name "${newDbName}" from template "${templateDbName}"`);
    await dataSource.query(`CREATE DATABASE "${newDbName}" TEMPLATE "${templateDbName}"`);
  }
}

async function deleteDbWithPrefixOrThrow(dataSource: DataSource, dbNamePrefix: string) {

  const result = await dataSource.query(
    `SELECT datname FROM pg_database WHERE datname like '${dbNamePrefix}%'`
  );

  for (const item of result) {
    const dbName = item.datname;
    const strSql = `DROP DATABASE IF EXISTS "${dbName}"`;
    console.log(strSql);
    await dataSource.query(strSql);
  }

  const result2 = await dataSource.query(
    `SELECT 1 FROM pg_database WHERE datname like '${dbNamePrefix}%'`
  );
  if (result2.length) {
    throw new Error(`A DB with the prefix ${dbNamePrefix} still exists!`);
  }
}

async function closeConnection(dataSource: DataSource) {
  await dataSource.destroy();
}

async function main() {
  const distFolder = __dirname;
  const LOCATION_OF_MIGRATION_JS_FILES = distFolder + '/src/db/migrations/**/*.{js,ts}';
  console.log('LOCATION_OF_MIGRATION_JS_FILES=' + LOCATION_OF_MIGRATION_JS_FILES)
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

  let dataSource = new DataSource({
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
    // const output = await createDatabase({ ifNotExist: true, characterSet: "UTF8" } as {});
    const DB_NAME = new Date().toISOString();
    await createNewDbOrThrow(dataSource, DB_NAME);
    await closeConnection(dataSource);

    selected_dbConfigFromEnvParams.database = DB_NAME;

    dataSource = new DataSource({
      ...dsOptions,
      ...selected_dbConfigFromEnvParams,
      port: DEFAULT_PORT,
    });
    await dataSource.initialize();
    await dataSource.runMigrations();
    await duplicateDbOrThrow(dataSource, `${DB_NAME}1111`, DB_NAME);
    await closeConnection(dataSource);


    dbConfigFromEnvParams_test.database = process.env.TEST_POSTGRESQL_DB_NAME,
    dataSource = new DataSource({
      ...dsOptions,
      ...selected_dbConfigFromEnvParams,
      port: DEFAULT_PORT,
    });
    await dataSource.initialize();
    await sleepPromise(10 * 1000);
    await deleteDbWithPrefixOrThrow(dataSource, DB_NAME);
    debugger;
    console.log('output');
    await dataSource.dropDatabase();

  } catch (err) {
    utils.consoleError(`${fn} - ${(err)}`);
    throw err;
  }
}

main();