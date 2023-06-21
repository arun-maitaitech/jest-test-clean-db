// import { DbOrmTestingInstance } from './src/db/DbOrmTestingInstance';
// import utils from './src/utils/utils';

const MINUTE_IN_MILLISECOND = 1000 * 60; // A minute in milliseconds
const timeoutForManualTesting = process.env.MANUAL_TESTING ? 9999 : 1;
jest.setTimeout(timeoutForManualTesting * MINUTE_IN_MILLISECOND); // in milliseconds

beforeEach(async () => {
  // NockHandler.runBeforeEachTest(true);
  // await DbOrmTestingInstance.resetDbConnection();
});

afterEach(() => {
  // NockHandler.runWhenEachTestIsOver();
});
