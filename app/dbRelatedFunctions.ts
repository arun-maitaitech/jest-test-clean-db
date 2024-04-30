import { DataSource } from 'typeorm';

export async function createNewDbOrThrow(dataSource: DataSource, dbName: string) {
  const result = await dataSource.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);

  if (result.length) {
    throw new Error(`A DB with the name ${dbName} already exists!`);
  } else {
    console.log(`Creating main template database with name "${dbName}"`);
    await dataSource.query(`CREATE DATABASE "${dbName}"`);
  }
}

export async function closeConnection(dataSource: DataSource) {
  await dataSource.destroy();
}

export async function duplicateDbOrThrow(dataSource: DataSource, newDbName: string, templateDbName: string) {
  const result = await dataSource.query(`SELECT 1 FROM pg_database WHERE datname = '${newDbName}'`);

  if (result.length) {
    throw new Error(`A DB with the name ${newDbName} already exists!`);
  } else {
    console.log(`Duplicating a new database with the name "${newDbName}" from template "${templateDbName}"...`);
    await dataSource.query(`CREATE DATABASE "${newDbName}" TEMPLATE "${templateDbName}"`);
  }
}

export async function deleteDb(dataSource: DataSource, dbName: string) {
  console.log(`Deleting the database with the name "${dbName}"...`);
  const strSql = `DROP DATABASE IF EXISTS "${dbName}"`;
  await dataSource.query(strSql);

  const result2 = await dataSource.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}%'`);
  if (result2.length) {
    throw new Error(`A DB with the prefix ${dbName} still exists!`);
  }
}
