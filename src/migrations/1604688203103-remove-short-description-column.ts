import {MigrationInterface, QueryRunner} from "typeorm";

export class removeShortDescriptionColumn1604688203103 implements MigrationInterface {
    name = 'removeShortDescriptionColumn1604688203103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "SavedStories" ALTER COLUMN "createdAt" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "SavedStories" ALTER COLUMN "updatedAt" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "Stories" ALTER COLUMN "createdAt" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "Stories" ALTER COLUMN "updatedAt" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "createdAt" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "updatedAt" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "Comments" ALTER COLUMN "createdAt" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "Comments" ALTER COLUMN "updatedAt" SET DEFAULT 'NOW()'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Comments" ALTER COLUMN "updatedAt" SET DEFAULT '2020-11-06 18:43:22.046702'`);
        await queryRunner.query(`ALTER TABLE "Comments" ALTER COLUMN "createdAt" SET DEFAULT '2020-11-06 18:43:22.046702'`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "updatedAt" SET DEFAULT '2020-11-06 18:43:22.046702'`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "createdAt" SET DEFAULT '2020-11-06 18:43:22.046702'`);
        await queryRunner.query(`ALTER TABLE "Stories" ALTER COLUMN "updatedAt" SET DEFAULT '2020-11-06 18:43:22.046702'`);
        await queryRunner.query(`ALTER TABLE "Stories" ALTER COLUMN "createdAt" SET DEFAULT '2020-11-06 18:43:22.046702'`);
        await queryRunner.query(`ALTER TABLE "SavedStories" ALTER COLUMN "updatedAt" SET DEFAULT '2020-11-06 18:43:22.046702'`);
        await queryRunner.query(`ALTER TABLE "SavedStories" ALTER COLUMN "createdAt" SET DEFAULT '2020-11-06 18:43:22.046702'`);
    }

}
