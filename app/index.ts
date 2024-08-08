import { DataSource } from 'typeorm';

import { MainDataSource } from './mainDataSource_singleton';

declare global {
  var testWithCleanDB: (
    name: string,
    fn: (dbData: { dbNameForThisTest: string; dbDataSource: DataSource }) => void,
    timeout?: number
  ) => void | undefined | Promise<void | undefined>;

  var describe_withCleanDb: (
    name: number | string | Function | jest.FunctionLike,
    fn: (dbData: { dbNameForThisTest: string; dbDataSource: DataSource }) => void
  ) => void;

  var mainDataSource: MainDataSource | undefined;
}
