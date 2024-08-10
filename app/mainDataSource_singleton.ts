import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

import { baseDataSourceOptions } from './baseDataSourceOptions';
import { closeConnection, createNewDbOrThrow, deleteDb, duplicateDbOrThrow } from './dbRelatedFunctions';
import { getTemplateDbName } from './templateDbNameGenerator_singleton';
import { consoleDebug } from './utils';

export class MainDataSource {
  private _dataSource: DataSource | null = null;
  private _templateDbName: string = '';
  private _templateCreationPromise: undefined | Promise<void> = undefined;

  private async _getDataSource() {
    if (!this._dataSource) {
      this._dataSource = new DataSource({
        ...baseDataSourceOptions,
        database: process.env.TEST_POSTGRESQL_DB_NAME || '',
      });
      await this._dataSource.initialize();
    }
    return this._dataSource;
  }

  /**
   * Create a template database for testing purposes, and runs migrations on it.
   *
   * @return {Promise<void>} Promise that resolves once the template database is created.
   */
  async createTemplateDB(): Promise<void> {
    if (!this._templateCreationPromise) {
      if (this._templateDbName) {
        throw new Error('jest-test-clean-db: Template database already created!');
      }
      this._templateDbName = getTemplateDbName();
      consoleDebug(`jest-test-clean-db - Creating main template database with name "${this._templateDbName}"`);
      this._templateCreationPromise = this._getDataSource()
        .then((_dataSourceInstance) => createNewDbOrThrow(_dataSourceInstance, this._templateDbName))
        .then(
          () =>
            new DataSource({
              ...baseDataSourceOptions,
              database: this._templateDbName,
            })
        )
        .then((templateDataSource) => {
          return templateDataSource
            .initialize()
            .then(() => templateDataSource.runMigrations())
            .then(() => closeConnection(templateDataSource));
        });
    }
    await this._templateCreationPromise;
  }

  wasEverInitialized() {
    return Boolean(this._templateCreationPromise);
  }

  async createTestDb_fromTemplateDB(testName: string) {
    if (!this._templateCreationPromise) {
      throw new Error(`jest-test-clean-db: Template database was not created. Use createTemplateDB() first!`);
    }
    await this._templateCreationPromise;
    const ds = await this._getDataSource();
    const dbNameForThisTest = `${this._templateDbName}-${testName}`;
    await duplicateDbOrThrow(ds, dbNameForThisTest, this._templateDbName);

    const dbForThisTest = new DataSource({
      ...baseDataSourceOptions,
      database: dbNameForThisTest,
    });
    await dbForThisTest.initialize();
    return { dbNameForThisTest, dbForThisTest };
  }

  async closeAndDelete_testDb(input: { dbNameForThisTest: string; dbForThisTest: DataSource }) {
    if (!this._templateCreationPromise) {
      throw new Error(`jest-test-clean-db: Template database was not created. Use createTemplateDB() first!`);
    }
    await this._templateCreationPromise;
    const { dbNameForThisTest, dbForThisTest } = input;
    await closeConnection(dbForThisTest);
    const ds = await this._getDataSource();
    await deleteDb(ds, dbNameForThisTest);
  }
  async closeAndDelete_templateDb() {
    if (this.wasEverInitialized()) {
      await this._templateCreationPromise;
      const ds = await this._getDataSource();
      await deleteDb(ds, this._templateDbName);
    }
  }
}

export function getMainDataSource() {
  if (!global.mainDataSource) {
    global.mainDataSource = new MainDataSource();
  }
  return global.mainDataSource;
}
