import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";

export const PostgresDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "mobility",
  synchronize: true,
  logging: true,
  entities: ["src/entities/**/*.ts"],
  migrationsTableName: "migrations",
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
});
