import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserCarUsageTables1722919800892 implements MigrationInterface {
    name = 'CreateUserCarUsageTables1722919800892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "driver" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_61de71a8d217d585ecd5ee3d065" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car" ("id" SERIAL NOT NULL, "plate" character varying NOT NULL, "color" character varying NOT NULL, "brand" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usage" ("id" SERIAL NOT NULL, "start_date" character varying NOT NULL, "end_date" character varying NOT NULL, "reason" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "usedById" integer, "usedCarId" integer, CONSTRAINT "PK_7bc33e71ab6c3b71eac72950b44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "usage" ADD CONSTRAINT "FK_92f1e982d7b86d151247f4bb797" FOREIGN KEY ("usedById") REFERENCES "driver"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usage" ADD CONSTRAINT "FK_ba4342f099f6e163bb6ed18b9f6" FOREIGN KEY ("usedCarId") REFERENCES "car"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usage" DROP CONSTRAINT "FK_ba4342f099f6e163bb6ed18b9f6"`);
        await queryRunner.query(`ALTER TABLE "usage" DROP CONSTRAINT "FK_92f1e982d7b86d151247f4bb797"`);
        await queryRunner.query(`DROP TABLE "usage"`);
        await queryRunner.query(`DROP TABLE "car"`);
        await queryRunner.query(`DROP TABLE "driver"`);
    }

}
