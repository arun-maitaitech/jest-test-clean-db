describe('describe', () => {
  test('fail', () => {
    expect(true).toBeFalsy();
  });

  test('success', () => {
    debugger;
    expect(1).toBeTruthy();
  });

  const TEST_NAME_WITH_DB = 'successDB';
  testWithCleanDB(TEST_NAME_WITH_DB, ({ dbNameForThisTest, dbDataSource }) => {
    debugger;
    expect(dbNameForThisTest).toMatch(new RegExp(`^\\d{17}-${TEST_NAME_WITH_DB}$`));
    expect(dbDataSource).toHaveProperty('isInitialized', true);
    expect(dbDataSource).toHaveProperty('isConnected', true);
    expect(dbDataSource.options.database).toMatch(dbNameForThisTest);
  });
});
