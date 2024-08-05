import cors from "cors";
import express, { Router } from "express";
import "dotenv/config";
import { PostgresDataSource } from "./config/data-source";
import logger from "./middlewares/logger";
import carRouters from "./controllers/car";

PostgresDataSource.initialize()
  .then(() => {
    console.log("Data Source initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

const app = express();
const route = Router();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/cars", carRouters);

app.use(route);

app.listen(4000, () => "server running on port 4000");