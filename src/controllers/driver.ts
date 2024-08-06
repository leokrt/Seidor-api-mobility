import { Router } from "express";
import { DriverService } from "../services/driver";
import { body, param } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import { DriverPayload, FilterDriver } from "../types/driver";

const router = Router();
const driverService = new DriverService();

router.post(
  "/",
  [body("name").notEmpty().withMessage("Name is required")],
  validateRequest,
  async (req, res, next) => {
    try {
      const result = await driverService.createDriver(
        req.body as DriverPayload
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  param("id").notEmpty().withMessage("ID from driver is required"),
  validateRequest,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await driverService.findById(parseInt(id));

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/", async (req, res, next) => {
  try {
    const { color, brand } = req.query;
    const filter = { color, brand } as FilterDriver;
    const result = await driverService.findAll(filter);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedCar = await driverService.updateDriver(Number(id), updateData);

    res.json(updatedCar);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  param("id").notEmpty().withMessage("ID from driver is required"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await driverService.deleteDriver(Number(id));

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
