import {MigrationInterface, QueryRunner} from "typeorm";

export class addThumbnailImgUrlColumn1605833842514 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Stories"
                                ADD COLUMN thumbnail_image_url VARCHAR NULL;
        `)
    }

    public async down(_: QueryRunner): Promise<void> {
    }

}
