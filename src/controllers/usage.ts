import { Router } from "express";
import { UsageService } from "../services/usage";
import { body, param } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import { UsagePayload, UpdateUsagePayload, FilterUsage } from "../types/usage";

const router = Router();
const usageService = new UsageService();

router.post(
  "/",
  [
    body("startDate")
      .isISO8601()
      .withMessage("Start date is required and should be in ISO format"),
    body("reason").notEmpty().withMessage("Reason is required"),
    body("driverId")
      .isInt()
      .withMessage("Driver ID is required and should be an integer"),
    body("carId")
      .isInt()
      .withMessage("Car ID is required and should be an integer"),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const result = await usageService.createUsage(req.body as UsagePayload);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:id",
  [
    param("id")
      .isInt()
      .withMessage("Utilization ID is required and should be an integer"),
    body("endDate").isISO8601().withMessage("End date should be in ISO format"),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await usageService.updateUsage(
        parseInt(id),
        req.body as UpdateUsagePayload
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  param("id")
    .isInt()
    .withMessage("Utilization ID is required and should be an integer"),
  validateRequest,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await usageService.findById(parseInt(id));
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/", async (req, res, next) => {
  try {
    const { driverName, carPlate } = req.query;
    const filter = { driverName, carPlate } as FilterUsage;
    const result = await usageService.findAll(filter);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
