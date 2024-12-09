import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

import { baseDataSourceOptions } from './baseDataSourceOptions';
import {
  closeConnection,
  createNewDbOrThrow,
  deleteDb,
  duplicateDbOrThrow,
  getTemplateDatabaseName,
  setTemplateDatabaseName
} from './dbRelatedFunctions';
import { getTemplateDbName } from './templateDbNameGenerator_singleton';
import { consoleDebug } from './utils';

export type IDataSourceInitiator = (dbName: string) => Promise<DataSource>;

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
  async createOrConnectToExistingTemplateDB(): Promise<void> {
    const existingTemplateDatabaseName = getTemplateDatabaseName();

    if (!this._templateCreationPromise) {
      if (this._templateDbName) {
        throw new Error('jest-test-clean-db: Template database already created!');
      }

      if (!existingTemplateDatabaseName) {
        this._templateDbName = getTemplateDbName();
      }
      consoleDebug(`Creating main template database with name "${this._templateDbName}"`);
      this._templateCreationPromise = this.createOrConnectToDB(existingTemplateDatabaseName ?
        { connectToDB_name: existingTemplateDatabaseName } : { createDB_name: this._templateDbName }
      )
        .then(async (templateDataSource) => {
          setTemplateDatabaseName(this._templateDbName);
          consoleDebug(`START - Applying migrations on the template database...`);
          const before = Date.now();
          await templateDataSource.runMigrations();
          const after = Date.now();
          consoleDebug(`FINISHED - Applying migrations on the template database... (${(after - before) / 1000} seconds)`);
          return await closeConnection(templateDataSource);
        });
    }
    await this._templateCreationPromise;
  }

  createOrConnectToDB = async (input: { createDB_name: string } | { connectToDB_name: string }) => { 
    
    const dataSourceExisting = await this._getDataSource();
    
    if('connectToDB_name' in input && input.connectToDB_name) {
      this._templateDbName = input.connectToDB_name;
    }

    if('createDB_name' in input && input.createDB_name) {
      await createNewDbOrThrow(dataSourceExisting, input.createDB_name);
    }

    const dataSourceNewlyInitiated = new DataSource({
      ...baseDataSourceOptions,
      database: this._templateDbName,
    });

    await dataSourceNewlyInitiated.initialize();

    return dataSourceNewlyInitiated;
  }

  wasEverInitialized() {
    return Boolean(this._templateCreationPromise);
  }

  async createTestDb_fromTemplateDB(testName: string, dataSourceInitiator: IDataSourceInitiator) {
    if (!this._templateCreationPromise) {
      throw new Error(`jest-test-clean-db: Template database was not created. Use createOrConnectToExistingTemplateDB() first!`);
    }
    await this._templateCreationPromise;
    const ds = await this._getDataSource();
    const dbNameForThisTest = `${this._templateDbName}-${testName}`;
    await duplicateDbOrThrow(ds, dbNameForThisTest, this._templateDbName);

    const dbForThisTest = await dataSourceInitiator(dbNameForThisTest);
    return { dbNameForThisTest, dbForThisTest };
  }

  async closeAndDelete_testDb(input: { dbNameForThisTest: string; dbForThisTest: DataSource }) {
    if (!this._templateCreationPromise) {
      throw new Error(`jest-test-clean-db: Template database was not created. Use createOrConnectToExistingTemplateDB() first!`);
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
