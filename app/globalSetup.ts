// import { DataSource } from 'typeorm';

// import { getMainDataSource } from './mainDataSource_singleton';

// const MAX_TEST_NAME_LENGTH = 40;
// const uniqueTestNames: Array<string> = [];


// function ensureGlobalFunctions() {
//   try {
//     /**
//      * Wraps a user function with validation and DB setup/teardown logic.
//      * This function runs in the global environment, and not in the test's environment/virtual machine.
//      *
//      * @param {string} testName - The name of the test.
//      * @param {(dbData: { dbNameForThisTest: string; dbDataSource: DataSource }) => void} userFn - The user function to be wrapped.
//      * @return {Promise<void>} - A promise that resolves when the wrapped function completes successfully, or rejects with an error if the wrapped function throws an error.
//      * @throws {Error} - If the test name exceeds the maximum allowed length or if the test name is not unique in the project.
//      */
//     const unwrap = (testName: string, userFn: (dbData: { dbNameForThisTest: string; dbDataSource: DataSource }) => void) => {
//       /**
//        * Validation of the test name
//        */
//       const describeBlockName = expect.getState().currentDescribeBlock || '';

//       if (MAX_TEST_NAME_LENGTH < testName.length) {
//         throw new Error(
//           `The test's name (${describeBlockName ? `${describeBlockName} > ` : ``}${testName}) has ${
//             testName.length
//           } characters, which exceeds the allowed length of ${MAX_TEST_NAME_LENGTH} characters. This is important as the DB software limits the DB name's length`
//         );
//       }

//       if (uniqueTestNames.includes(testName)) {
//         throw new Error(
//           `Test name (${
//             describeBlockName ? `${describeBlockName} > ` : ``
//           }${testName}) is not unique in this project. This might cause it to use the same DB of another test`
//         );
//       } else {
//         uniqueTestNames.push(testName);
//       }

//       const underlyingFunctionToReturn = async () => {
//         /**
//          * The `initDB` function must be called here, because this is the first place that is "per-test" inside of the `test_withCleanDB` function
//          */
//         const mainDataSource = getMainDataSource();

//         const { dbNameForThisTest, dbForThisTest } = await mainDataSource.createTestDb_fromTemplateDB(testName);

//         let resultOfTheUnderlyingWrappedFunction: void = undefined;
//         let errorFromTestFn: Error | null = null;
//         try {
//           resultOfTheUnderlyingWrappedFunction = userFn({ dbNameForThisTest, dbDataSource: dbForThisTest });
//         } catch (_errFromTestFn) {
//           errorFromTestFn = _errFromTestFn;
//         } finally {
//           await mainDataSource.closeAndDelete_testDb({ dbNameForThisTest, dbForThisTest });
//         }

//         if (errorFromTestFn) {
//           throw errorFromTestFn;
//         } else {
//           return resultOfTheUnderlyingWrappedFunction;
//         }
//       };
//       return underlyingFunctionToReturn;
//     };

//     const _test_withCleanDB = (
//       testName: string,
//       userFn: (dbData: { dbNameForThisTest: string; dbDataSource: DataSource }) => void,
//       timeout?: number
//     ) => {
//       // Call the actual Jest's *test* function along with the (validated) test name and test function
//       return global.test(testName, unwrap(testName, userFn), timeout);
//     };

//     global.test_withCleanDB = global.test_withCleanDB || _test_withCleanDB;

//     const _describeWithCleanDB = (
//       testName: number | string | Function | jest.FunctionLike,
//       userFn: (dbData: { dbNameForThisTest: string; dbDataSource: DataSource }) => void
//     ) => {
//       // Call the actual Jest's *describe* function along with the (validated) block name and block function
//       const _testName = typeof testName === 'function' || typeof testName === 'object' ? testName.name : String(testName);
//       return global.describe(testName, unwrap(_testName, userFn));
//     };
//     global.describe_withCleanDb = global.describe_withCleanDb || _describeWithCleanDB;

//     // Initialize the DB
//     void getMainDataSource().createTemplateDB();

//   } catch (e) {
//     console.error(e);
//   }
// }
// export default ensureGlobalFunctions;
