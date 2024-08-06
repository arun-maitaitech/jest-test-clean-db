import { DataSource } from 'typeorm';

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
}
