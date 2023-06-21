import 'dotenv/config';
// import NockHandler from './src/handlers/NockHandler';
// import utils from './src/utils/utils';

// process.on('unhandledRejection', (reason, promise) => {
//   utils.consoleError(`---------
//     Warning: Unhandled Promise Rejection!
//     Usually this happens when:
//     (1) Promise rejects, and there's no catch.
//     (2) Promise inside a promise: The parent promise has 'catch', but the child doesn't use 'return' (which bubble up the Error/rejection to the parent).
//     Also, you can catch it at the child, and re-throw a parsed error for example.
//     This problem is easy to spot, because the parent Promise never resolves/rejects/finishes.
//     (3) Functions with callback functions might also be dangerous if not properly returned.

//     Promise: ${promise}
//     Reason: ${utils.convertToString(reason)}
//     ---------`);
// });

// process.on('uncaughtException', (err) => {
//   utils.consoleError('---------\nUncaught Exception at: ' + err.stack + '\n---------');
// });

process.env.IS_TEST = '1'; // Don't change this, otherwise the production DB might be affected!
process.env.TEST_START_TIMESTAMP = new Date().toISOString().replace(/:/g, '_').replace(/\./g, '_');
process.env.SLACK_ERROR_CHANNEL = '';
// const old_POSTGRESQL_DB_NAME = process.env.POSTGRESQL_HOSTNAME;

// process.env.POSTGRESQL_HOSTNAME = process.env.TEST_POSTGRESQL_HOSTNAME;
// process.env.POSTGRESQL_DB_NAME = process.env.TEST_POSTGRESQL_DB_NAME;
// process.env.POSTGRESQL_PASSWORD = process.env.TEST_POSTGRESQL_PASSWORD;
// process.env.POSTGRESQL_USERNAME = process.env.TEST_POSTGRESQL_USERNAME;

// if (old_POSTGRESQL_DB_NAME == process.env.POSTGRESQL_DB_NAME) {
//   throw new Error(
//     `old_POSTGRESQL_DB_NAME (${old_POSTGRESQL_DB_NAME}) == process.env.POSTGRESQL_DB_NAME (${process.env.POSTGRESQL_DB_NAME})`
//   );
// }

export default async () => {
  return; // Do nothing
};
