import { Router } from "express";
import { CarService } from "../services/car";
import { body, param } from "express-validator";
import validateRequest from "../middlewares/validateRequest";
import { CarPayload } from "../types/car";

const router = Router();
const carService = new CarService();

router.post(
  "/",
  [
    body("plate").notEmpty().withMessage("Plate is required"),
    body("color").notEmpty().withMessage("Color is required"),
    body("brand").notEmpty().withMessage("Brand is required"),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const result = await carService.createCar(req.body as CarPayload);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  param("id").notEmpty().withMessage("id from vehicle is required"),
  validateRequest,
  async (req, res, next) => {
    const { id } = req.params;

    try {
      const result = await carService.findById(parseInt(id));
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/", async (req, res) => {
  res.send({ status_code: 200, msg: "get car" });
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedCar = await carService.updateCar(Number(id), updateData);
    res.json(updatedCar);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  param("id").notEmpty().withMessage("id from vehicle is required"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await carService.deleteCar(Number(id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
