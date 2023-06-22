// import { DbOrmTestingInstance } from './src/db/DbOrmTestingInstance';
import utils from './src/utils/utils';

import { DataSource, DataSourceOptions } from "typeorm";

const MINUTE_IN_MILLISECOND = 1000 * 60; // A minute in milliseconds
const timeoutForManualTesting = process.env.MANUAL_TESTING ? 9999 : 1;
jest.setTimeout(timeoutForManualTesting * MINUTE_IN_MILLISECOND); // in milliseconds

const MAX_TEST_NAME_LENGTH = 40;
const uniqueTestNames: Array<string> = [];

const distFolder = __dirname;
const LOCATION_OF_MIGRATION_JS_FILES = distFolder + '/src/db/migrations/**/*.{js,ts}';
// console.log('LOCATION_OF_MIGRATION_JS_FILES=' + LOCATION_OF_MIGRATION_JS_FILES)
const DEFAULT_PORT = 5432;

let otherActionOnTemplateDb: Promise<void> | undefined = undefined;

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
  host: process.env.TEST_POSTGRESQL_HOSTNAME || '',
  username: process.env.TEST_POSTGRESQL_USERNAME || '',
  password: process.env.TEST_POSTGRESQL_PASSWORD || '',
  database: process.env.TEST_POSTGRESQL_DB_NAME || '',
  port: DEFAULT_PORT,
};

const TEMPLATE_DB_NAME = new Date().toISOString().substring(0, 19).replace(/-/g, "").replace(/:/g, "").replace(/T/g, "");
const mainDataSource = new DataSource(dsOptions);
let isInit = false;


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

  const result = await dataSource.query(
    `SELECT 1 FROM pg_database WHERE datname = '${newDbName}'`
  );

  if (result.length) {
    throw new Error(`A DB with the name ${newDbName} already exists!`);
  } else {
    console.log(`Creating database with name "${newDbName}" from template "${templateDbName}"`);
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


function replaceTestGlobalFunction() {
  try {
    const originalTest = global.test;
    const tmp: jest.It = Object.assign(function (name: string, fn: (dbNameForThisTest: string)=>void, timeout?: number) {
      const describeName = expect.getState().currentDescribeBlock || '';

      if (MAX_TEST_NAME_LENGTH < name.length) {
        throw new Error(`Test name (${describeName ? `${describeName} > ` : ``}${name}) exceeds the maximum length of ${MAX_TEST_NAME_LENGTH} characters.`);
      }

      if (uniqueTestNames.includes(name)) {
        throw new Error(`Test name (${describeName ? `${describeName} > ` : ``}${name}) is not unique in this project. This might cause it to use the DB of another test`);
      } else {
        uniqueTestNames.push(name);
      }

      const asyncFn: Parameters<typeof global.test>[1] = async function () {
        await initDB();
        const dbNameForThisTest = `${TEMPLATE_DB_NAME}-${name}`;
        await duplicateDbOrThrow(mainDataSource, dbNameForThisTest, TEMPLATE_DB_NAME)
        return fn(dbNameForThisTest);
      }

      // Call the actual Jest's test function with the validated test name and test function
      return originalTest(name, asyncFn, timeout);
    });

    // console.log('11111=' + global.test);
    global.test = tmp;
    // console.log('22222=' + global.test);
  } catch (e) {
    console.error('eeee=' + e);
  }
}

replaceTestGlobalFunction();

// beforeEach(async function(this: jest.Lifecycle) {
//   // NockHandler.runBeforeEachTest(true);
//   // await DbOrmTestingInstance.resetDbConnection();

//   // const testName = this.currentTest.fullName;
//   // console.log(`Test name: ${this}=====  ${this}`);
//   // console.log(this);
// });

// afterEach(() => {
//   // NockHandler.runWhenEachTestIsOver();
// });
