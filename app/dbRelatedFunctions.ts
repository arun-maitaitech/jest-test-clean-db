import { DataSource } from 'typeorm';

import { consoleDebug } from './utils';
import { getSharedGlobalData, setSharedGlobalData } from './sharedGlobalData';

async function checkIfDbExists(dataSource: DataSource, dbName: string) {
  const result = await dataSource.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
  return Boolean(result.length);
}

async function assertDbDoesNotExist(dataSource: DataSource, dbName: string) {
  const doesAlreadyExist = await checkIfDbExists(dataSource, dbName);
  if (doesAlreadyExist) {
    throw new Error(`jest-test-clean-db.assertDbDoesNotExist - Assertion failed! A DB with the name ${dbName} does exist!`);
  }
}

export async function createNewDbOrThrow(dataSource: DataSource, dbName: string) {
  await assertDbDoesNotExist(dataSource, dbName);
  await dataSource.query(`CREATE DATABASE "${dbName}"`);
}

export async function closeConnection(dataSource: DataSource) {
  await dataSource.destroy();
}

export function getTemplateDatabaseName() {
  const sharedData = getSharedGlobalData();
  return sharedData.templateDbName || null;
}

export function setTemplateDatabaseName(templateDbName: string) {
  const sharedData = getSharedGlobalData();
  return setSharedGlobalData({ ...sharedData, templateDbName });
}


export async function duplicateDbOrThrow(dataSource: DataSource, newDbName: string, templateDbName: string) {
  await assertDbDoesNotExist(dataSource, newDbName);
  consoleDebug(`Duplicating a new database with the name "${newDbName}" from template "${templateDbName}"...`);
  await dataSource.query(`CREATE DATABASE "${newDbName}" TEMPLATE "${templateDbName}"`);
}

export async function deleteDb(dataSource: DataSource, dbName: string) {
  consoleDebug(`Deleting the database with the name "${dbName}"...`);
  const strSql = `DROP DATABASE IF EXISTS "${dbName}"`;
  await dataSource.query(strSql);
  await assertDbDoesNotExist(dataSource, dbName);
}
