import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnIsPublishedOnStory1604858793613 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Stories"
                                ADD COLUMN isPublished boolean`
                                )
    }

    public async down(): Promise<void> {
    }

}
