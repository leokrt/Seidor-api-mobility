import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger.json";
import "dotenv/config";
import { PostgresDataSource } from "./config/data-source";
import logger from "./middlewares/logger";
import carRouters from "./controllers/car";
import driverRouters from "./controllers/driver";
import usageRouters from "./controllers/usage";
import errorHandler from "./middlewares/errorHandler";

PostgresDataSource.initialize()
  .then(() => {
    console.log("Data Source initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/cars", carRouters);
app.use("/drivers", driverRouters);
app.use("/usage", usageRouters);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler);

app.listen(process.env.PORT, () => "Server running on port 4000");
