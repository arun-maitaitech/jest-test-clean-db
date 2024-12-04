<!-- spell-checker:ignore typeof -->

# jest-test-clean-db

[![npm version](https://badge.fury.io/js/jest-test-clean-db.svg)](https://badge.fury.io/js/jest-test-clean-db)
[![Downloads](https://img.shields.io/npm/dm/jest-test-clean-db.svg)](https://www.npmjs.com/package/jest-test-clean-db)
[![GitHub issues](https://img.shields.io/github/issues/Asaf-S/jest-test-clean-db)](https://github.com/Asaf-S/jest-test-clean-db/issues)

## Purpose
For each `jest` run, this library will:
1. Creates a new empty "template" DB.
1. Applies the TypeORM migrations files on it.
1. For each pre-selected test:
    1. Make a copy of the "template" DB (which contains the migration files' changes).
    1. Run the test as usual on a empty prepared DB.
1. Clean up.

## Installing

For the latest stable version:

```bash
npm install -D jest-test-clean-db@latest
```

## Setup (after installation)

### Prerequisite ( Add ENV ):
Add ENV variable in your .env `TYPEORM_DS_OPTIONS_PATH` with the path of the dsOptions_config.js file.   
for eg:  `TYPEORM_DS_OPTIONS_PATH=dist/src/db`

### Step 1: **Use the `test_withCleanDB` and `describe_withCleanDB` functions**:

Import the `test_withCleanDB` and `describe_withCleanDB` functions, and use them instead of `test` and `describe` wherever you need a clean initialized DB in your test files:

```typescript
// some_test_file.test.ts
import { test_withCleanDB } from 'jest-test-clean-db';

describe('D1', () => {
  test_withCleanDB('Test with a clean DB', ({ dbNameForThisTest, dbDataSource }) => {
    expect(dbNameForThisTest).toBeTrue();

    const userRepository = dbDataSource.getRepository(Users);
    await userRepository.insert({ name: 'test1' });
    const user = await userRepository.findOne({ where: { id: 1 } });
    expect(user).not.toBeNull();
  });

  test('test2', async () => {
    // No clean DB for you
  });
});

describe_withCleanDB('D2', ({ dbNameForThisTest, dbDataSource }) => {
  test('T1', () => {
    // Uses the same clean DB as the 'T2' test
    expect(typeof dbNameForThisTest).toEqual('string');
    dbDataSource.getRepository(Users);
  });

  test('T2', () => {
    // Uses the same clean DB as the 'T1' test
    expect(typeof dbNameForThisTest).toEqual('string');
    dbDataSource.getRepository(Users);
  });
});
```

### Step 2: **Env params**:

Add the following environment params to reach your testing DB (if this solution doesn't fit your need, leave an issue and let me know):

```JS
TEST_POSTGRESQL_HOSTNAME=
TEST_POSTGRESQL_DB_NAME=
TEST_POSTGRESQL_USERNAME=
TEST_POSTGRESQL_PASSWORD=
```

### Step 3: **Edit the `jest.config.js` file**:

Add the following values to the following Jest's config file's keys:

```javascript
// jest.config.js
{
  // ...
  "globalSetup": "jest-test-clean-db/globalSetup",
  "globalTeardown": "jest-test-clean-db/globalTeardown"
  // ...
}
```

<details>
  <summary>Click to read why must this step be done, despite everything seems to work without it</summary>

If you just use the functions `test_withCleanDB` and `describe_withCleanDB` - everything will seem to be working, however, 2 databases will be created per such test/describe (one will be used as a "template" and copy of it for the test - both will be created per test/describe created with the special functions), and also only one of them (the test database) will be deleted, while the "template" database will remain, which will cause the DB to be filled-up eventually and throw errors.
In order to avoid such behavior, and to cause everything to work as expected - you need to add the following values to the following Jest's config file's keys:

</details>
<details>
  <summary>Having problems with this step? Click to read more...</summary>

The `globalSetup` key accept only string, this is why you can't add an array as its value.

It means that this is not possible: `"globalSetup": ["./localGlobalSetupFile", "jest-test-clean-db/globalSetup"]`.

The way to get around it, is to add the following line as the first one in the existing file (`localGlobalSetupFile.js` in our example:
```js
// file: localGlobalSetupFile.js
import 'jest-test-clean-db/globalSetup';
```

This solves this error message:
```
Option "globalSetup" must be of type:
  string
but instead received:
  array
Example:
{
  "globalSetup": "setup.js"
}
Configuration Documentation:
https://jestjs.io/docs/configuration
```
</details>

## Wanna help out?

- [ ] Add support for other ways to connect to the DB (connection string? import details from a file?).
- [ ] Add support for other ORMs.
- [ ] Add support for MySQL and other DBs.
- [ ] Better test `describe_withCleanDB`.
- [ ] Make the test file of the repository's demo project work despite testing failed tests (maybe forward the tests' output to a file, and compare the file with a pre-defined one).

<!--
  TODO:
  1. Explain JEST_TEST_CLEAN_DB_DEBUG env param somewhere;
-->
