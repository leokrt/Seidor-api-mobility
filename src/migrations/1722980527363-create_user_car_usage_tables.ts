import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserCarUsageTables1722980527363 implements MigrationInterface {
    name = 'CreateUserCarUsageTables1722980527363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "driver" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_61de71a8d217d585ecd5ee3d065" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car" ("id" SERIAL NOT NULL, "plate" character varying NOT NULL, "color" character varying NOT NULL, "brand" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usage" ("id" SERIAL NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP, "reason" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "used_by" integer, "used_car" integer, CONSTRAINT "PK_7bc33e71ab6c3b71eac72950b44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "usage" ADD CONSTRAINT "FK_ee01567d5014058c24253658816" FOREIGN KEY ("used_by") REFERENCES "driver"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usage" ADD CONSTRAINT "FK_f8b80e932e8eca2a8a451030768" FOREIGN KEY ("used_car") REFERENCES "car"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usage" DROP CONSTRAINT "FK_f8b80e932e8eca2a8a451030768"`);
        await queryRunner.query(`ALTER TABLE "usage" DROP CONSTRAINT "FK_ee01567d5014058c24253658816"`);
        await queryRunner.query(`DROP TABLE "usage"`);
        await queryRunner.query(`DROP TABLE "car"`);
        await queryRunner.query(`DROP TABLE "driver"`);
    }

}
