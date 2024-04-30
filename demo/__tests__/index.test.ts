import 'jest-test-clean-db';

describe('Main describe', () => {
  describe('No DB involved', () => {
    test('Test which fails', () => {
      expect(true).toBeFalsy();
    });

    test('Test which throws an error', () => {
      throw new Error();
    });

    test('Test which succeeds', () => {
      // debugger;
      expect(1).toBeTruthy();
    });
  });

  describe('DB involved', () => {
    testWithCleanDB('Test which fails', () => {
      expect(true).toBeFalsy();
    });

    testWithCleanDB('Test which throws an error', () => {
      throw new Error();
    });

    const TEST_NAME_WITH_DB = 'Test which succeeds';
    testWithCleanDB(TEST_NAME_WITH_DB, ({ dbNameForThisTest, dbDataSource }) => {
      // debugger;
      expect(dbNameForThisTest).toMatch(new RegExp(`^\\d{17}-${TEST_NAME_WITH_DB}$`));
      expect(dbDataSource).toHaveProperty('isInitialized', true);
      expect(dbDataSource).toHaveProperty('isConnected', true);
      expect(dbDataSource.options.database).toMatch(dbNameForThisTest);
    });

    testWithCleanDB('nameTooLong_nameTooLong_nameTooLong_nameTooLong_nameTooLong_nameTooLong_', ({ dbNameForThisTest, dbDataSource }) => {
      // The test should fail before even starting - because the name is too long.
      expect(true).toBeTruthy();
    });

    const TEST_WITH_THE_SAME_NAME = 'TEST_WITH_THE_SAME_NAME';
    testWithCleanDB(TEST_WITH_THE_SAME_NAME, ({ dbNameForThisTest, dbDataSource }) => {
      // The test should succeed, as it's the first test with the same name
      expect(true).toBeTruthy();
    });
    describe('Even if it\'s nested in another describe block', () => {

      testWithCleanDB(TEST_WITH_THE_SAME_NAME, ({ dbNameForThisTest, dbDataSource }) => {
        // The test should fail, as there's another test with the same name
        expect(true).toBeTruthy();
      });
    });
  });
});
