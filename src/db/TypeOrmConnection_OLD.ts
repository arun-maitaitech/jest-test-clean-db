// import 'dotenv/config';
// import { DataSource, DataSourceOptions } from 'typeorm';
// // import { newDb } from 'pg-mem';

// import utils from '../utils/utils';
// // import { Contacts } from '../entities/FromDB/Contacts.model';
// // import { Industry } from '../entities/FromDB/Industry.model';
// // import { Loan } from '../entities/FromDB/Loan.model';
// // import { Version } from '../entities/FromDB/Version.model';
// // import { LoanInstruction } from '../entities/FromDB/LoanInstruction.model';
// // import { Deletion } from '../entities/FromDB/Deletion.model';
// // import { Installments } from '../entities/FromDB/Installments.model';
// // import { LoanView } from '../entities/FromDB/LoanView';
// // import { Installments_View } from '../entities/FromDB/Installments_View';
// // import { Masav_EncodedMasavFiles } from '../entities/FromDB/Masav_EncodedMasavFiles.model';
// // import { Bank } from '../entities/FromDB/Bank.model';
// // import { BankBranch } from '../entities/FromDB/BankBranch.model';
// // import { OwnBankAccounts } from '../entities/FromDB/OwnBankAccounts.model';
// // import { CounterPartyBankAccounts } from '../entities/FromDB/CounterPartyBankAccounts.model';
// // import { FinancialIndexDefinition } from '../entities/FromDB/FinancialIndexDefinitions.model';
// // import { Transactions } from '../entities/FromDB/Transactions.model';
// // import { FinancialIndexChange } from '../entities/FromDB/FinancialIndexChanges.model';
// // import { LedgerDefinitions } from '../entities/FromDB/LedgerDefinitions.model';
// // import { NonBusinessDays } from '../entities/FromDB/NonBusinessDays.model';
// // import { CacheCorporate } from '../entities/FromDB/CacheCorporate.model';
// // import { Currencies } from '../entities/FromDB/Currencies.model';
// // import { NotificationInstances } from '../entities/FromDB/NotificationInstances.model';
// // import { ContactGroup } from '../entities/FromDB/ContactGroup.model';
// // import { Fees } from '../entities/FromDB/Fees.model';
// // import { M2MDealContactRelation } from '../entities/FromDB/M2MDealContactRelation.model';
// // import { Waivers } from '../entities/FromDB/Waivers.model';
// // import { InternalAccount } from '../entities/FromDB/InternalAccount.model';
// // import { Ledger } from '../entities/FromDB/Ledger.model';
// // import { Cheques } from '../entities/FromDB/Cheques.model';
// // import { ChequeLocation } from '../entities/FromDB/ChequeLocation.model';
// // import { M2MContactInternalAccount } from '../entities/FromDB/M2MContactInternalAccount.model';
// // import { M2MContactCounterPartyBankAccounts } from '../entities/FromDB/M2MContactCounterPartyBankAccounts.model';
// // import { ChequeEndorsers } from '../entities/FromDB/ChequeEndorsers.model';

// type IOrmOptions = Partial<{ cleanDB: true /* schema: string, dropSchemaOnClose: boolean */ }>;

// // https://dev.to/oguimbal/how-to-really-unit-test-code-that-uses-a-db-3gmg
// const distFolder = __dirname.includes('/dist/src/db') ? __dirname : __dirname.replace('/src/db', '/dist/src/db');
// const LOCATION_OF_ENTITIES_JS_FILES = distFolder + '/../entities/FromDB/**/*.{js,ts}';
// const LOCATION_OF_MIGRATION_JS_FILES = distFolder + '/migrations/**/*.{js,ts}';

// const DEFAULT_SCHEMA = 'public';
// const DEFAULT_PORT = 5432;
// const SHOULD_DUMP_DB_ON_DISCONNECT = false;

// const dbConfigFromEnvParams_test = {
//   host: process.env.TEST_POSTGRESQL_HOSTNAME,
//   username: process.env.TEST_POSTGRESQL_USERNAME,
//   password: process.env.TEST_POSTGRESQL_PASSWORD,
//   database: process.env.TEST_POSTGRESQL_DB_NAME,
// };

// const dbConfigFromEnvParams = {
//   host: process.env.POSTGRESQL_HOSTNAME,
//   username: process.env.POSTGRESQL_USERNAME,
//   password: process.env.POSTGRESQL_PASSWORD,
//   database: process.env.POSTGRESQL_DB_NAME,
// };

// export class TypeOrmConnection {
//   private dataSource: DataSource;
//   private connectionPromise: Promise<DataSource>;
//   private fn: string = 'TypeORM (not initialized yet)';
//   // private isCleanDB = false;

//   constructor(options?: IOrmOptions) {
//     utils.assertEnvParams(['POSTGRESQL_DB_NAME', 'POSTGRESQL_HOSTNAME', 'POSTGRESQL_PASSWORD', 'POSTGRESQL_USERNAME']);

//     let dsOptions: DataSourceOptions = {
//       type: 'postgres',
//       entities: [
//         /** / LOCATION_OF_ENTITIES_JS_FILES, /**/
//         Contacts,
//         Industry,
//         Loan,
//         Version,
//         LoanInstruction,
//         Deletion,
//         Installments,
//         LoanView,
//         Installments_View,
//         Masav_EncodedMasavFiles,
//         Bank,
//         BankBranch,
//         OwnBankAccounts,
//         CounterPartyBankAccounts,
//         FinancialIndexDefinition,
//         Transactions,
//         FinancialIndexChange,
//         LedgerDefinitions,
//         NonBusinessDays,
//         CacheCorporate,
//         Currencies,
//         NotificationInstances,
//         ContactGroup,
//         Fees,
//         M2MDealContactRelation,
//         Waivers,
//         InternalAccount,
//         Ledger,
//         Cheques,
//         ChequeLocation,
//         M2MContactInternalAccount,
//         M2MContactCounterPartyBankAccounts,
//         ChequeEndorsers,
//         /**/
//       ],
//       migrations: [LOCATION_OF_MIGRATION_JS_FILES],
//       migrationsRun: true,
//       logging: utils.isReallyTrue(process.env.POSTGRESQL_DEBUGGING),
//       // schema: options?.schema || DEFAULT_SCHEMA,
//       // dropSchema,
//       synchronize: false,
//       // extra: {
//       //   connectionLimit: utils.isProd() ? 10 : 5,
//       // },
//     };

//     let selected_dbConfigFromEnvParams: Record<string, unknown>;
//     if (
//       utils.isReallyTrue(process.env.IS_TEST) ||
//       (options?.cleanDB && !utils.isProd()) ||
//       process.env.TEST_START_TIMESTAMP
//     ) {
//       // ds = newDb().adapters.createTypeormDataSource(dsOptions);
//       // // this.isCleanDB = true;
//       // this.fn = `TypeORM (in-mem clean db ${Math.random()})`;

//       // //   const db = newDb();
//       // //   const connection = await db.adapters.createTypeormConnection({
//       // //     type: 'postgres',
//       // //     entities: [/* your entities here ! */]
//       // // })
//       // throw new Error('Not working yet!');

//       selected_dbConfigFromEnvParams = dbConfigFromEnvParams_test;
//       dsOptions = {
//         ...dsOptions,
//         dropSchema: true,
//       };
//     } else {
//       selected_dbConfigFromEnvParams = dbConfigFromEnvParams;
//     }

//     this.fn = `TypeORM (${selected_dbConfigFromEnvParams.username || 'undefined'}@${
//       selected_dbConfigFromEnvParams.host || 'undefined'
//     }/${selected_dbConfigFromEnvParams.database || 'undefined'})`;

//     this.dataSource = new DataSource({
//       ...dsOptions,
//       ...selected_dbConfigFromEnvParams,
//       port: DEFAULT_PORT,
//     });
//     this.connectionPromise = this.init();
//   }

//   private init = async () => {
//     try {
//       if (!this.dataSource.isInitialized) {
//         utils.consoleLog(`${this.fn} - Connecting...`);
//         await this.dataSource.initialize();
//         utils.consoleLog(`${this.fn} - Connected!`);
//       }
//       // if (this.isCleanDB) {
//       //   await this.dataSource.runMigrations();
//       //   this.isCleanDB = false;
//       // }
//       return this.dataSource;
//     } catch (err) {
//       utils.consoleError(`${this.fn} - ${utils.convertToString(err)}`);
//       throw err;
//     }
//   };

//   connect = async () => {
//     return this.connectionPromise;
//   };

//   disconnect = async () => {
//     if (this.dataSource) {
//       if (SHOULD_DUMP_DB_ON_DISCONNECT) {
//         const folderName = `${process.env.TEST_START_TIMESTAMP}/${expect.getState().currentTestName}`;
//         // const collections = await this.dataSource.listCollections().toArray();
//         // for (const _collection of collections) {
//         //   await utils.runCLI(
//         //     // spell-checker:ignore jsonl
//         //     `mongoExport --uri="${this.uri}${mongoConn.dbConfig.database}" --collection=${_collection.name} --out="./tempDbDumps/${folderName}/${_collection.name}.jsonl"`
//         //   );
//         // }
//       }
//       // await this.dataSource.disconnect();
//     }
//     return this.dataSource.destroy();
//   };

//   getDataSource = () => {
//     if (!this.dataSource) {
//       const strErr = `${this.fn}.getDataSource - Error: this.dataSource is ${this.dataSource}`;
//       utils.consoleError(strErr);
//       throw new Error(strErr);
//     }

//     return this.dataSource;
//   };

//   getInitializedDataSource = async () => {
//     try {
//       await this.connectionPromise;
//     } catch (err) {
//       // Do nothing...
//     }

//     return this.getDataSource();
//   };
// }
