import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

import { baseDataSourceOptions } from './baseDataSourceOptions';
import { createNewDbOrThrow, deleteDb, duplicateDbOrThrow } from './dbRelatedFunctions';

class MainDataSource {
  private _dataSource: DataSource | null = null;

  private async _getDS() {
    if (!this._dataSource) {
      this._dataSource = new DataSource({
        ...baseDataSourceOptions,
        database: process.env.TEST_POSTGRESQL_DB_NAME || '',
      });
      await this._dataSource.initialize();
    }
    return this._dataSource;
  }

  wasEverInitialized() {
    return Boolean(this._dataSource);
  }

  async useMainDataSource_toCreateNewDbOrThrow(newDbName: string) {
    const ds = await this._getDS();
    return await createNewDbOrThrow(ds, newDbName);
  }

  async useMainDataSource_toDuplicateDbOrThrow(newDbName: string, templateDbName: string) {
    const ds = await this._getDS();
    return await duplicateDbOrThrow(ds, newDbName, templateDbName);
  }

  async useMainDataSource_toDeleteDb(dbName: string) {
    const ds = await this._getDS();
    await deleteDb(ds, dbName);
  }
}

let mainDataSource: MainDataSource | null = null;

export function getMainDataSource() {
  if (!mainDataSource) {
    mainDataSource = new MainDataSource();
  }
  return mainDataSource;
}
