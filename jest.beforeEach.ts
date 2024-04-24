// spell-checker:ignore typeorm datname
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DataSource, DataSourceOptions } from 'typeorm';

import utils from './src/utils/utils';

const MINUTE_IN_MILLISECOND = 1000 * 60; // A minute in milliseconds
const timeoutForManualTesting = process.env.MANUAL_TESTING ? 9999 : 1;
jest.setTimeout(timeoutForManualTesting * MINUTE_IN_MILLISECOND); // in milliseconds

const MAX_TEST_NAME_LENGTH = 40;
const uniqueTestNames: Array<string> = [];

const distFolder = __dirname;
const LOCATION_OF_MIGRATION_JS_FILES = distFolder + '/src/db/migrations/**/*.{js,ts}';
// console.log('LOCATION_OF_MIGRATION_JS_FILES=' + LOCATION_OF_MIGRATION_JS_FILES)
const DEFAULT_PORT = 5432;

let dsOptions: PostgresConnectionOptions = {
  type: 'postgres',
  entities: [],
  migrations: [LOCATION_OF_MIGRATION_JS_FILES],
  migrationsRun: false,
  logging: utils.isReallyTrue(process.env.POSTGRESQL_DEBUGGING),
  // schema: options?.schema || DEFAULT_SCHEMA,
  // dropSchema,
  synchronize: false,
  // extra: {
  //   connectionLimit: utils.isProd() ? 10 : 5,
  // },
  host: process.env.TEST_POSTGRESQL_HOSTNAME || '',
  username: process.env.TEST_POSTGRESQL_USERNAME || '',
  password: process.env.TEST_POSTGRESQL_PASSWORD || '',
  database: process.env.TEST_POSTGRESQL_DB_NAME || '',
  port: DEFAULT_PORT,
};

const TEMPLATE_DB_NAME = new Date()
  .toISOString()
  .substring(0, 23)
  .replace(/[-T:\.]/g, '');
const mainDataSource = new DataSource(dsOptions);
let isInit = false;

async function createNewDbOrThrow(dataSource: DataSource, dbName: string) {
  const result = await dataSource.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);

  if (result.length) {
    throw new Error(`A DB with the name ${dbName} already exists!`);
  } else {
    console.log(`Creating main template database with name "${dbName}"`);
    await dataSource.query(`CREATE DATABASE "${dbName}"`);
  }
}

async function closeConnection(dataSource: DataSource) {
  await dataSource.destroy();
}

async function initDB() {
  if (!isInit) {
    await mainDataSource.initialize();
    await createNewDbOrThrow(mainDataSource, TEMPLATE_DB_NAME);
    // await closeConnection(mainDataSource);

    const newDsOptions: DataSourceOptions = {
      type: 'postgres',
      entities: [],
      migrations: [LOCATION_OF_MIGRATION_JS_FILES],
      migrationsRun: false,
      logging: utils.isReallyTrue(process.env.POSTGRESQL_DEBUGGING),
      // schema: options?.schema || DEFAULT_SCHEMA,
      // dropSchema,
      synchronize: false,
      // extra: {
      //   connectionLimit: utils.isProd() ? 10 : 5,
      // },
      host: process.env.TEST_POSTGRESQL_HOSTNAME || '',
      username: process.env.TEST_POSTGRESQL_USERNAME || '',
      password: process.env.TEST_POSTGRESQL_PASSWORD || '',
      database: TEMPLATE_DB_NAME,
      port: DEFAULT_PORT,
    };

    const templateDataSource = new DataSource(newDsOptions);
    await templateDataSource.initialize();
    await templateDataSource.runMigrations();
    await closeConnection(templateDataSource);
  }
  isInit = true;
}

async function duplicateDbOrThrow(dataSource: DataSource, newDbName: string, templateDbName: string) {
  const result = await dataSource.query(`SELECT 1 FROM pg_database WHERE datname = '${newDbName}'`);

  if (result.length) {
    throw new Error(`A DB with the name ${newDbName} already exists!`);
  } else {
    console.log(`Duplicating a new database with the name "${newDbName}" from template "${templateDbName}"...`);
    // if (otherActionOnTemplateDb) {
    //   console.log(`waiting - ${newDbName}`)
    //   await otherActionOnTemplateDb;
    //   console.log(`waited - ${newDbName}`)
    // }
    // otherActionOnTemplateDb = new Promise(async (resolve) => {
    await dataSource.query(`CREATE DATABASE "${newDbName}" TEMPLATE "${templateDbName}"`);
    //   otherActionOnTemplateDb = undefined;
    //   return resolve();
    // });
  }
}

async function deleteDb(dataSource: DataSource, dbName: string) {
  console.log(`Deleting the database with the name "${dbName}"...`);
  const strSql = `DROP DATABASE IF EXISTS "${dbName}"`;
  await dataSource.query(strSql);

  const result2 = await dataSource.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}%'`);
  if (result2.length) {
    throw new Error(`A DB with the prefix ${dbName} still exists!`);
  }
}

/**
 * The reasons I'm replacing the `test()` function, instead of using the `beforeEach` function, is that unfortunately accessing the
 * test name directly within the `beforeEach` function located in a file listed under the "setupFilesAfterEnv" key of the Jest config
 * file is not possible, and I need it for the DB name.
 *
 * The reason I'm not running `replaceTestGlobalFunction` in the `beforeAll` function:
 * * The `beforeAll` function in `*.test.ts` files: Because the we'll have to remember mentioning it per file, instead once in central location.
 * * The `beforeAll` function in this file: Because the `describe()` and `test()` functions (not the test functions that are given to them as input) run before it.
 */
function replaceTestGlobalFunction() {
  try {
    const originalTestFn = global.test;
    // TODO: clean up and delete the template DB.

    global.testWithCleanDB = function (
      name: string,
      fn: (dbData: { dbNameForThisTest: string; dbDataSource: DataSource }) => void,
      timeout?: number
    ) {
      const asyncFn: Parameters<typeof global.test>[1] = async function () {
        const describeBlockName = expect.getState().currentDescribeBlock || '';

        if (MAX_TEST_NAME_LENGTH < name.length) {
          throw new Error(
            `The test's name (${describeBlockName ? `${describeBlockName} > ` : ``}${name}) has ${
              name.length
            } characters, which exceeds the allowed length of ${MAX_TEST_NAME_LENGTH} characters. This is important as the DB name's length is limited`
          );
        }

        if (uniqueTestNames.includes(name)) {
          throw new Error(
            `Test name (${
              describeBlockName ? `${describeBlockName} > ` : ``
            }${name}) is not unique in this project. This might cause it to use the same DB of another test`
          );
        } else {
          uniqueTestNames.push(name);
        }

        /**
         * The `initDB` function must be called here, because this is the first place that is "per-test" inside of the `testWithCleanDB` function
         */
        await initDB();

        const dbNameForThisTest = `${TEMPLATE_DB_NAME}-${name}`;
        await duplicateDbOrThrow(mainDataSource, dbNameForThisTest, TEMPLATE_DB_NAME);
        let voidResult: void = undefined;
        let errorFromTestFn: Error | null = null;
        const dbForThisTest = new DataSource({
          ...dsOptions,
          database: dbNameForThisTest,
        });
        await dbForThisTest.initialize();
        try {
          voidResult = fn({ dbNameForThisTest, dbDataSource: dbForThisTest });
        } catch (_errFromTestFn) {
          errorFromTestFn = _errFromTestFn;
        } finally {
          await closeConnection(dbForThisTest);
          await deleteDb(mainDataSource, dbNameForThisTest);
        }

        if (errorFromTestFn) {
          throw errorFromTestFn;
        } else {
          return voidResult;
        }
      };

      // Call the actual Jest's test function along with the (validated) test name and test function
      return originalTestFn(name, asyncFn, timeout);
    };
  } catch (e) {
    console.error(e);
  }
}
replaceTestGlobalFunction();
