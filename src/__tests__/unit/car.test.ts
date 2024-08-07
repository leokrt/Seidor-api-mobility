import { CarService } from "../../services/car";
import { CarRepository } from "../../repositories/car";
import { Car } from "../../entities/Car";
import { NotFoundException } from "../../utils/errors";

describe("Unit tests for Car service", () => {
  jest.mock("typeorm", () => {
    const originalModule = jest.requireActual("typeorm");
    return {
      ...originalModule,
      Repository: jest.fn().mockImplementation(() => ({
        save: jest.fn(),
      })),
    };
  });
  let carRepository: CarRepository;
  let serviceCar: CarService;
  let car: Car;
  const carPayload = {
    plate: "FOO-BAR",
    color: "red",
    brand: "Toyota",
  };

  beforeEach(() => {
    carRepository = new CarRepository();
    serviceCar = new CarService();

    car = new Car();
    car.id = 1;
    car.plate = "FOO-BAR";
    car.color = "red";
    car.brand = "Toyota";
  });

  describe("Creation of car", () => {
    it("Should create a car", async () => {
      const mockSave = jest
        .spyOn(carRepository["repository"], "save")
        .mockResolvedValue(car);
      jest
        .spyOn(carRepository["repository"], "findOneBy")
        .mockResolvedValue(undefined);
      const result = await serviceCar.createCar(carPayload);

      expect(result).toHaveProperty("id");
      expect(mockSave).toHaveBeenCalledWith(carPayload);
    });

    it("should throw an error if the plate is already in use", async () => {
      const mockFindByPlate = jest
        .spyOn(carRepository["repository"], "findOneBy")
        .mockResolvedValue(car);

      await expect(serviceCar.createCar(carPayload)).rejects.toThrow(
        "Plate already in use"
      );
      expect(mockFindByPlate).toHaveBeenCalledWith({ plate: carPayload.plate });
    });
  });

  describe("Delete a car", () => {
    it("should throw NotFoundException if the car does not exist", async () => {
      jest
        .spyOn(carRepository["repository"], "findOneBy")
        .mockResolvedValue(undefined);

      await expect(serviceCar.deleteCar(1)).rejects.toThrow(NotFoundException);
    });

    it("should delete the car if it exists", async () => {
      jest
        .spyOn(carRepository["repository"], "findOneBy")
        .mockResolvedValue(car);
      const softDeleteByIdSpy = jest
        .spyOn(carRepository["repository"], "softDelete")
        .mockResolvedValue(null);

      await serviceCar.deleteCar(1);

      expect(softDeleteByIdSpy).toHaveBeenCalledWith({
        id: 1,
        plate: car.plate,
      });
    });
  });

  describe("Retrieve a list of cars", () => {
    it("should return all cars without filters", async () => {
      const cars: Car[] = [car, { ...car, brand: "BMW", color: "green" }];
      jest.spyOn(carRepository["repository"], "find").mockResolvedValue(cars);

      const result = await serviceCar.findAll();

      expect(result).toEqual(cars);
      expect(carRepository["repository"].find).toHaveBeenCalledWith({
        where: {},
      });
    });

    it("should return filtered cars by color and brand", async () => {
      const cars: Car[] = [car];
      jest.spyOn(carRepository["repository"], "find").mockResolvedValue(cars);

      const result = await serviceCar.findAll({
        color: "red",
        brand: "Toyota",
      });

      expect(result).toEqual(cars);
      expect(carRepository["repository"].find).toHaveBeenCalledWith({
        where: {
          color: "red",
          brand: "Toyota",
        },
      });
    });
  });

  describe("Retrieve a car by id", () => {
    it("should throw NotFoundException if the car does not exist", async () => {
      jest
        .spyOn(carRepository["repository"], "findOneBy")
        .mockResolvedValue(undefined);
      await expect(serviceCar.findById(1)).rejects.toThrow(NotFoundException);
    });

    it("should return the car if it exists", async () => {
      jest
        .spyOn(carRepository["repository"], "findOneBy")
        .mockResolvedValue(car);

      const result = await serviceCar.findById(1);

      expect(result).toEqual(car);
    });
  });

  describe("Update a Car", () => {
    it("should throw NotFoundException if the car does not exist", async () => {
      jest
        .spyOn(carRepository["repository"], "findOneBy")
        .mockResolvedValue(undefined);

      await expect(serviceCar.updateCar(1, { color: "blue" })).rejects.toThrow(
        NotFoundException
      );
    });

    it("should return the updated car if it exists", async () => {
      jest
        .spyOn(carRepository["repository"], "findOneBy")
        .mockResolvedValue(car);
      const mockSave = jest
        .spyOn(carRepository["repository"], "save")
        .mockResolvedValue({ ...car, color: "blue" });

      const result = await serviceCar.updateCar(1, { color: "blue" });

      expect(result.color).toBe("blue");
      expect(mockSave).toHaveBeenCalledWith({ ...car, color: "blue" });
    });
  });
});
