import {MigrationInterface, QueryRunner} from "typeorm";

export class setNullOnThumbnailImageUrlColumn1605903330799 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Stories"
            ALTER COLUMN thumbnail_image_url DROP NOT NULL;
        `)

    }

    public async down(_: QueryRunner): Promise<void> {
    }

}
