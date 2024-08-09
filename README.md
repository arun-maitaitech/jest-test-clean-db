<!-- spell-checker:ignore typeof -->
# jest-test-clean-db

[![npm version](https://badge.fury.io/js/jest-test-clean-db.svg)](https://badge.fury.io/js/jest-test-clean-db)
[![Downloads](https://img.shields.io/npm/dm/jest-test-clean-db.svg)](https://www.npmjs.com/package/jest-test-clean-db)

This library:
1. Creates a new empty "template" DB for each `jest` run.
2. Applies the TypeORM migrations files on it.
3. Make a copy of the "template" DB for each test that uses the `test_withCleanDB` function instead of jest's `test`, and describe block that uses the `describe_withCleanDB` function instead of jest's `describe`.
The `test_withCleanDB` and `describe_withCleanDB` functions are just wrappers of jest's `test` and `describe` function, to extend them.

## Installing

For the latest stable version:

```bash
npm install -D jest-test-clean-db@latest
```

## Setup (after installation)

### Step 1: **Types** (skip if not using TypeScript):

In order for the `test_withCleanDB` to be available in TypeScript, add the following file to your `tsconfig.json` file (under the `file` or `include` keys):
```
/node_modules/jest-test-clean-db/dist/index.d.ts
```
Assuming you're using TypeScript, without setting up this step properly - you'll get the following error in each run `error TS2304: Cannot find name 'test_withCleanDB'`.

Example:
```json
// tsconfig.json

{

  // ...

  "files": ["./node_modules/jest-test-clean-db/dist/index.d.ts"]
}
```

### Step 2: **Use the `test_withCleanDB` and `describe_withCleanDB` functions**:
Import the `test_withCleanDB` and `describe_withCleanDB` functions instead of `test` and `describe`, and use them wherever you need a clean initialized DB in your test files:

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

describe_withCleanDB('D2', () => {
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

### Step 3: **Env params**:
Add the following environment params to reach your testing DB (if this solution doesn't fit your need, leave an issue and let me know):

```JS
TEST_POSTGRESQL_HOSTNAME=
TEST_POSTGRESQL_DB_NAME=
TEST_POSTGRESQL_USERNAME=
TEST_POSTGRESQL_PASSWORD=
```

### Step 4: **Edit the `jest.config.js` file**:
If you just use the functions `test_withCleanDB` and `describe_withCleanDB` - everything will seem to be working, however, 2 databases will be created per such test/describe (one will be used as a "template" and copy of it for the test - both will be created per test/describe created with the special functions), and also only one of them (the test database) will be deleted, while the "template" database will remain, which will cause the DB to be filled-up eventually and throw errors.
In order to avoid such behavior, and to cause everything to work as expected - you need to add the following values to the following Jest's config file's keys:
```json
// jest.config.js
{
  // ...
  globalSetup: 'jest-test-clean-db/globalSetup',
  globalTeardown: 'jest-test-clean-db/globalTeardown',
  // ...
}
```

## Want to help you?
- [ ] Support other ways to connect to the DB (connection string? import details from a file?)
- [ ] Support other ORMs
- [ ] Support MySQL and other DBs
- [ ] Testing
