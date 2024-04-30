import { DataSource } from 'typeorm';

declare global {
  var testWithCleanDB: (
    name: string,
    fn: (dbData: { dbNameForThisTest: string; dbDataSource: DataSource }) => void,
    timeout?: number
  ) => void | undefined;
}
