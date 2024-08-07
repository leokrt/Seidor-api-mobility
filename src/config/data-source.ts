import "reflect-metadata";
import { DataSource } from "typeorm";

export const PostgresDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "mobility",
  synchronize: true,
  logging: false,
  entities: ["src/entities/**/*.ts"],
  migrationsTableName: "migrations",
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
});
