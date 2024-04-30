import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DataSource } from 'typeorm';

import { getTemplateDbName } from './templateDbNameGenerator_singleton';
import { closeConnection, createNewDbOrThrow, deleteDb, duplicateDbOrThrow } from './dbRelatedFunctions';

// const MINUTE_IN_MILLISECOND = 1000 * 60; // A minute in milliseconds
// const timeoutForManualTesting = process.env.MANUAL_TESTING ? 9999 : 1;
// jest.setTimeout(timeoutForManualTesting * MINUTE_IN_MILLISECOND); // in milliseconds

const MAX_TEST_NAME_LENGTH = 40;
const uniqueTestNames: Array<string> = [];

const distFolder = __dirname;
const LOCATION_OF_MIGRATION_JS_FILES = distFolder + '/src/db/migrations/**/*.{js,ts}';
// console.log('LOCATION_OF_MIGRATION_JS_FILES=' + LOCATION_OF_MIGRATION_JS_FILES)
const DEFAULT_PORT = 5432;

let baseDataSourceOptions: PostgresConnectionOptions = {
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

const mainDataSource = new DataSource({
  ...baseDataSourceOptions,
  database: process.env.TEST_POSTGRESQL_DB_NAME || '',
});
let isInit = false;

const templateDbName = getTemplateDbName();

async function initDB() {
  if (!isInit) {
    await mainDataSource.initialize();
    await createNewDbOrThrow(mainDataSource, templateDbName);
    // await closeConnection(mainDataSource);

    const templateDataSource = new DataSource({
      ...baseDataSourceOptions,
      database: templateDbName,
    });
    await templateDataSource.initialize();
    await templateDataSource.runMigrations();
    await closeConnection(templateDataSource);
  }
  isInit = true;
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
            } characters, which exceeds the allowed length of ${MAX_TEST_NAME_LENGTH} characters. This is important as the DB software limits the DB name's length`
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

        const dbNameForThisTest = `${templateDbName}-${name}`;
        await duplicateDbOrThrow(mainDataSource, dbNameForThisTest, templateDbName);
        let voidResult: void = undefined;
        let errorFromTestFn: Error | null = null;
        const dbForThisTest = new DataSource({
          ...baseDataSourceOptions,
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
