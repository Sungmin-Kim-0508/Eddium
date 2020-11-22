import {MigrationInterface, QueryRunner} from "typeorm";

export class changeColumnNameToContent1604688500131 implements MigrationInterface {

    public async up(_: QueryRunner): Promise<void> {
        // await queryRunner.query(`
        //     ALTER TABLE "Stories"
        //     RENAME COLUMN longdesc TO content
        // `)
    }

    public async down(): Promise<void> {
    }

}
