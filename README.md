
# jest-test-clean-db

[![npm version](https://badge.fury.io/js/jest-test-clean-db.svg)](https://badge.fury.io/js/jest-test-clean-db)
[![Downloads](https://img.shields.io/npm/dm/jest-test-clean-db.svg)](https://www.npmjs.com/package/jest-test-clean-db)

This library:
1. Creates a new empty "template" DB in each `jest` run.
2. Applies the migrations files on it.
3. Make a copy of the "template" DB for each test that uses the `testWithCleanDB` function instead of jest's `test`.\
The `testWithCleanDB` function is just a wrapper for jest's `test`, and just extends it.

## Installing

For the latest stable version:

```bash
npm install -D jest-test-clean-db
```

## Setup (after installation)

### Step 1: **Types** (skip if not using TypeScript):

In order for the `testWithCleanDB` to be available in TypeScript, add the following file to your `tsconfig.json` file (under the `file` or `include` keys):
```
/node_modules/jest-test-clean-db/dist/index.d.ts
```
Assuming you're using TypeScript, without setting up this step properly - you'll get the following error in each run `error TS2304: Cannot find name 'testWithCleanDB'`.
Example:
```json
// tsconfig.json

{

  // ...

  "files": ["./node_modules/jest-test-clean-db/dist/index.d.ts"]
}
```

### Step 2: **Define the `testWithCleanDB` function**:
In the `jest.config.js` file, add `jest-test-clean-db/setupFilesAfterEnv` under the `setupFilesAfterEnv` key.\
Without setting up this step, you'll get the following error in each run `ReferenceError: testWithCleanDB is not defined`.\
Example:

```json
// jest.config.js

module.exports = {

  // ...

  setupFilesAfterEnv: ['jest-test-clean-db/setupFilesAfterEnv'],

};
```

### Step 3: **Define the clean up logic**:
In the `jest.config.js` file, add `jest-test-clean-db/setupFilesAfterEnv` under the `globalTeardown` key.\
This will delete the template DB that was created during each `jest` run. Without this step, the target DB will contain 1 more newly-created DB in each `npm run test` run.

Example:

```json
// jest.config.js

module.exports = {

  // ...

  globalTeardown: 'jest-test-clean-db/globalTeardown',
};
```

### Step 4: **Env params**:
Add the following environment params to reach your testing DB (if this solution doesn't fit your need, leave an issue and let me know):

```JS
TEST_POSTGRESQL_HOSTNAME=
TEST_POSTGRESQL_DB_NAME=
TEST_POSTGRESQL_USERNAME=
TEST_POSTGRESQL_PASSWORD=
```

### Step 5: **Use the function**:
In test files, use `testWithCleanDB()` instead of `test()`.
Example:
```TypeScript

testWithCleanDB('test1', async ({ dbNameForThisTest, dbDataSource }) => {
  expect(dbNameForThisTest).toBeTrue();

  const userRepository = dbDataSource.getRepository('Users');
  await userRepository.insert({ name: 'test1' });
  const user = await userRepository.findOne({ where: { id: 1 } });
  expect(user).not.toBeNull();
});

test('test2', async () => {
  // No clean DB for you
});
```
