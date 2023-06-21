// // spell-checker:ignore Metadatas
// import utils from '../utils/utils';
// import { DataSource } from 'typeorm';
// import { TypeOrmConnection } from './TypeOrmConnection';

// export class DbOrmTestingInstance {
//   // static _instances: Partial<Record<'testing', DataSource>> = {};
//   static _promise: Promise<DataSource> | undefined;

//   static getOrmInstance = async () => {
//     if (!DbOrmTestingInstance._promise) {
//       const orm = new TypeOrmConnection({ cleanDB: true });
//       DbOrmTestingInstance._promise = orm.getInitializedDataSource();
//     }

//     return await DbOrmTestingInstance._promise;
//   };

//   // static clearAllTablesContent = async () => {
//   //   // TODO: Clear the DB tables. Read this: https://stackoverflow.com/questions/58779347/jest-typeorm-purge-database-after-all-tests
//   //   const db = await DbOrmTestingInstance.getOrmInstance();

//   //   for (const entity of db.entityMetadatas) {
//   //     const repository = db.getRepository(entity.name); // Get repository
//   //     await repository.clear(); // Clear each entity table's content
//   //   }
//   // }

//   /**
//    * Disconnects and re-connect to the DB.
//    * If configured right, the schema should be dropped and re-initialized.
//    */
//   static resetDbConnection: () => Promise<void> = async () => {
//     try {
//       const db = await DbOrmTestingInstance.getOrmInstance();
//       // const entities = db.entityMetadatas;
//       // const tableNames = entities.map((entity) => `"${entity.tableName}"`).join(', ');

//       // await db.query(`TRUNCATE ${tableNames} CASCADE;`);
//       if (process.env.IS_TEST && /*!utils.isProd() &&*/ process.env.TEST_START_TIMESTAMP) {
//         // await db.dropDatabase();
//         await db.destroy(); // Disconnects from DB, the schema should be dropped at the next connection establishment
//         await db.initialize();
//         await db.runMigrations();
//       } else {
//         throw new Error(`TypeOrmConnection.resetDB - Error: Wrong params!`);
//       }
//       utils.consoleLog('[TEST DATABASE]: Clean');
//     } catch (error) {
//       const errMsg = `DB ERROR: Cleaning test database: ${error}`;
//       utils.consoleLog('Error: ' + errMsg);
//       throw new Error(errMsg);
//     }
//   };
// }
