import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DataSource } from 'typeorm';

import { getTemplateDbName } from './templateDbNameGenerator_singleton';
import { closeConnection, createNewDbOrThrow, deleteDb, duplicateDbOrThrow } from './dbRelatedFunctions';
import { getMainDataSource } from './mainDataSource_singleton';
import { baseDataSourceOptions } from './baseDataSourceOptions';

const MAX_TEST_NAME_LENGTH = 40;
const uniqueTestNames: Array<string> = [];

let isInit = false;

const templateDbName = getTemplateDbName();

async function initDB() {
  if (!isInit) {
    const mainDataSource = await getMainDataSource();
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
 * The reason I'm not running `ensureGlobalFunctions` in the `beforeAll` function:
 * * The `beforeAll` function in `*.test.ts` files: Because the we'll have to remember mentioning it per file, instead once in central location.
 * * The `beforeAll` function in this file: Because the `describe()` and `test()` functions (not the test functions that are given to them as input) run before it.
 */
function ensureGlobalFunctions() {
  try {
    const unwrap = async (name: string, fn: (dbData: { dbNameForThisTest: string; dbDataSource: DataSource }) => void) => {
      /**
       * Validation of the test name
       */
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

      const mainDataSource = await getMainDataSource();

      const dbNameForThisTest = `${templateDbName}-${name}`;
      await duplicateDbOrThrow(mainDataSource, dbNameForThisTest, templateDbName);

      const dbForThisTest = new DataSource({
        ...baseDataSourceOptions,
        database: dbNameForThisTest,
      });
      await dbForThisTest.initialize();

      const underlyingFunctionToReturn = async () => {
        let resultOfTheUnderlyingWrappedFunction: void = undefined;
        let errorFromTestFn: Error | null = null;
        try {
          resultOfTheUnderlyingWrappedFunction = fn({ dbNameForThisTest, dbDataSource: dbForThisTest });
        } catch (_errFromTestFn) {
          errorFromTestFn = _errFromTestFn;
        } finally {
          await closeConnection(dbForThisTest);
          await deleteDb(mainDataSource, dbNameForThisTest);
        }

        if (errorFromTestFn) {
          throw errorFromTestFn;
        } else {
          return resultOfTheUnderlyingWrappedFunction;
        }
      };
      return underlyingFunctionToReturn;
    };

    const _testWithCleanDB = async (
      name: string,
      fn: (dbData: { dbNameForThisTest: string; dbDataSource: DataSource }) => void,
      timeout?: number
    ) => {
      // Call the actual Jest's *test* function along with the (validated) test name and test function
      const unwrappedFunction = await unwrap(name, fn);
      return global.test(name, unwrappedFunction, timeout);
    };

    global.testWithCleanDB = global.testWithCleanDB || _testWithCleanDB;

    const _describeWithCleanDB = async (
      name: number | string | Function | jest.FunctionLike,
      fn: (dbData: { dbNameForThisTest: string; dbDataSource: DataSource }) => void
    ) => {
      // Call the actual Jest's *describe* function along with the (validated) block name and block function
      const _name = typeof name === 'function' || typeof name === 'object' ? name.name : String(name);
      const unwrappedFunction = await unwrap(_name, fn);
      return global.describe(name, unwrappedFunction);
    };
    global.describe_withCleanDb = global.describe_withCleanDb || _describeWithCleanDB;
  } catch (e) {
    console.error(e);
  }
}
ensureGlobalFunctions();
