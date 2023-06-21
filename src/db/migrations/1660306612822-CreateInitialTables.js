"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInitialTables1660306612822 = void 0;
class CreateInitialTables1660306612822 {
    constructor() {
        this.name = 'CreateInitialTables1660306612822';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "Industry" ("id" SERIAL NOT NULL, "industryName" character varying NOT NULL, CONSTRAINT "PK_63f1b157e1b38646de8686ffb85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."EntityUnit_entitytype_enum" AS ENUM('P', 'C')`);
        await queryRunner.query(`CREATE TABLE "EntityUnit" ("entityUnitInternalID" SERIAL NOT NULL, "nationalIdentityNumber" character varying NOT NULL, "entityType" "public"."EntityUnit_entitytype_enum" NOT NULL, "firstNameHebrew" character varying NOT NULL, "lastNameHebrew" character varying NOT NULL, "firstNameEnglish" character varying NOT NULL, "lastNameEnglish" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "zipCode" integer NOT NULL, "phoneNumber" character varying NOT NULL, "email" character varying NOT NULL, "notes" character varying NOT NULL, "industryID" integer, CONSTRAINT "UQ_d21d220493ce7071d17b489cf95" UNIQUE ("nationalIdentityNumber"), CONSTRAINT "PK_94d8a125ae62b293406f7e39db4" PRIMARY KEY ("entityUnitInternalID"))`);
        await queryRunner.query(`CREATE TABLE "FinancialIndex" ("indexID" SERIAL NOT NULL, "indexName" character varying NOT NULL, "initialValue" numeric(7,2) NOT NULL, CONSTRAINT "PK_8380fb9d8fa1a31a2b40f50ac4a" PRIMARY KEY ("indexID"))`);
        await queryRunner.query(`CREATE TYPE "public"."LoanInstruction_typeofinstruction_enum" AS ENUM('IO', 'N', 'ARM', 'EMI', 'EMI_P', 'EP', 'EMI_B', 'EMI_PB', 'EPB', 'A', 'PICA')`);
        await queryRunner.query(`CREATE TABLE "LoanInstruction" ("versionID" integer NOT NULL, "instructionID" integer NOT NULL, "typeOfInstruction" "public"."LoanInstruction_typeofinstruction_enum" NOT NULL, "dayOfMonth" integer NOT NULL, "numberOfPeriods" integer NOT NULL, "amount" integer, "periodsForPaymentCalculation" integer, CONSTRAINT "PK_eb4d965bd6e2fc7830a6b303aa9" PRIMARY KEY ("versionID", "instructionID"))`);
        await queryRunner.query(`CREATE TABLE "Version" ("versionID" SERIAL NOT NULL, "isManualUpdate" boolean NOT NULL, "description" character varying NOT NULL, "changeTimeStamp" TIMESTAMP NOT NULL, "performerOfChange" character varying NOT NULL, "engineVersion" character varying NOT NULL, "loanID" integer, CONSTRAINT "PK_5c667beaae1ba3beba1aed1ba42" PRIMARY KEY ("versionID"))`);
        await queryRunner.query(`CREATE TYPE "public"."Loan_loanstatus_enum" AS ENUM('D', 'P', 'C', 'F')`);
        await queryRunner.query(`CREATE TABLE "Loan" ("loanInternalID" SERIAL NOT NULL, "loanType" character varying NOT NULL, "isAffectedByPrime" boolean NOT NULL, "startDate" TIMESTAMP NOT NULL, "plannedInterestRate" numeric(7,2) NOT NULL, "arrearsInterestRate" numeric(7,2) NOT NULL, "loanStatus" "public"."Loan_loanstatus_enum" NOT NULL, "currentVersionID" integer, "entityUnitInternalID" integer, "financialIndexID" integer, CONSTRAINT "PK_d4efe363eea85991de413d180a8" PRIMARY KEY ("loanInternalID"))`);
        await queryRunner.query(`ALTER TABLE "EntityUnit" ADD CONSTRAINT "FK_bb7c69f258a004b8db17113772f" FOREIGN KEY ("industryID") REFERENCES "Industry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "LoanInstruction" ADD CONSTRAINT "FK_2573eead9b21cdac7304f19af60" FOREIGN KEY ("versionID") REFERENCES "Version"("versionID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Version" ADD CONSTRAINT "FK_fc4fcf16e64ae473d11ed233400" FOREIGN KEY ("loanID") REFERENCES "Loan"("loanInternalID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Loan" ADD CONSTRAINT "FK_ebf0a4b5e88c87a0c2989b54b83" FOREIGN KEY ("entityUnitInternalID") REFERENCES "EntityUnit"("entityUnitInternalID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Loan" ADD CONSTRAINT "FK_37982d21a596f2e7705a4efe5a5" FOREIGN KEY ("financialIndexID") REFERENCES "FinancialIndex"("indexID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "Loan" DROP CONSTRAINT "FK_37982d21a596f2e7705a4efe5a5"`);
        await queryRunner.query(`ALTER TABLE "Loan" DROP CONSTRAINT "FK_ebf0a4b5e88c87a0c2989b54b83"`);
        await queryRunner.query(`ALTER TABLE "Version" DROP CONSTRAINT "FK_fc4fcf16e64ae473d11ed233400"`);
        await queryRunner.query(`ALTER TABLE "LoanInstruction" DROP CONSTRAINT "FK_2573eead9b21cdac7304f19af60"`);
        await queryRunner.query(`ALTER TABLE "EntityUnit" DROP CONSTRAINT "FK_bb7c69f258a004b8db17113772f"`);
        await queryRunner.query(`DROP TABLE "Loan"`);
        await queryRunner.query(`DROP TYPE "public"."Loan_loanstatus_enum"`);
        await queryRunner.query(`DROP TABLE "Version"`);
        await queryRunner.query(`DROP TABLE "LoanInstruction"`);
        await queryRunner.query(`DROP TYPE "public"."LoanInstruction_typeofinstruction_enum"`);
        await queryRunner.query(`DROP TABLE "FinancialIndex"`);
        await queryRunner.query(`DROP TABLE "EntityUnit"`);
        await queryRunner.query(`DROP TYPE "public"."EntityUnit_entitytype_enum"`);
        await queryRunner.query(`DROP TABLE "Industry"`);
    }
}
exports.CreateInitialTables1660306612822 = CreateInitialTables1660306612822;
//# sourceMappingURL=1660306612822-CreateInitialTables.js.map