import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";

export const PostgresDataSource = new DataSource({
  type: "postgres",
  host: "postgres",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "mobility",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
