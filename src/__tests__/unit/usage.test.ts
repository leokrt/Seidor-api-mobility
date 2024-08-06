import { UsageService } from "../../services/usage";
import { UsageRepository } from "../../repositories/usage";
import { DriverService } from "../../services/driver";
import { CarService } from "../../services/car";
import {
  UsagePayload,
  UpdateUsagePayload,
  FilterUsage,
} from "../../types/usage";
import { NotFoundException } from "../../utils/errors";
import { Driver } from "../../entities/Driver";
import { Car } from "../../entities/Car";
import { Usage } from "../../entities/Usage";

jest.mock("../../services/driver");
jest.mock("../../services/car");

describe("UsageService", () => {
  jest.mock("typeorm", () => {
    const originalModule = jest.requireActual("typeorm");
    return {
      ...originalModule,
      Repository: jest.fn().mockImplementation(() => ({
        save: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        softDelete: jest.fn(),
        findById: jest.fn(),
      })),
    };
  });
  let usageService: UsageService;
  let usageRepository: UsageRepository;
  let driverService: DriverService;
  let carService: CarService;

  beforeEach(() => {
    // Instanciar os mocks
    driverService = new DriverService() as jest.Mocked<DriverService>;
    carService = new CarService() as jest.Mocked<CarService>;
    usageRepository = new UsageRepository() as jest.Mocked<UsageRepository>;

    // Substituir as dependências no serviço
    usageService = new UsageService();
    (usageService as any).usageRepository = usageRepository;
    (usageService as any).driverService = driverService;
    (usageService as any).carService = carService;
  });

  describe("create a Usage", () => {
    it("should create a utilization", async () => {
      const payload: UsagePayload = {
        startDate: new Date(),
        reason: "Business trip",
        driverId: 1,
        carId: 1,
      };

      const used_by = { id: 1, name: "John Doe" } as Driver;
      const used_car = { id: 1, plate: "ABC-1234" } as Car;
      const usage = {
        id: 1,
        start_date: payload.startDate,
        used_by,
        used_car,
        reason: payload.reason,
        end_date: null,
      } as Usage;

      jest.spyOn(carService, "findById").mockResolvedValue(used_car);
      jest.spyOn(driverService, "findById").mockResolvedValue(used_by);

      const mockSave = jest
        .spyOn(usageRepository["repository"], "save")
        .mockResolvedValue(usage);

      const result = await usageService.createUsage(payload);

      expect(result).toEqual(usage);
      expect(driverService.findById).toHaveBeenCalledWith(payload.driverId);
      expect(carService.findById).toHaveBeenCalledWith(payload.carId);
      expect(mockSave).toHaveBeenCalledWith(
        expect.objectContaining({
          start_date: payload.startDate,
          reason: payload.reason,
          used_by,
          used_car,
        })
      );
    });

    it("should throw NotFoundException if driver not found", async () => {
      const payload: UsagePayload = {
        startDate: new Date(),
        reason: "Business trip",
        driverId: 1,
        carId: 1,
      };
      jest.spyOn(driverService, "findById").mockResolvedValue(null);

      await expect(usageService.createUsage(payload)).rejects.toThrow(
        NotFoundException
      );
    });

    it("should throw NotFoundException if car not found", async () => {
      const payload: UsagePayload = {
        startDate: new Date(),
        reason: "Business trip",
        driverId: 1,
        carId: 1,
      };

      const driver = { id: 1, name: "John Doe" } as Driver;

      jest.spyOn(driverService, "findById").mockResolvedValue(driver);
      jest.spyOn(carService, "findById").mockResolvedValue(null);

      await expect(usageService.createUsage(payload)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("update Usage", () => {
    it("should update a utilization", async () => {
      const id = 1;
      const updateData: UpdateUsagePayload = { endDate: new Date() };

      const usage = {
        id,
        start_date: new Date(),
        end_date: null,
        reason: "Business trip",
        used_by: { id: 1, name: "John Doe" },
        used_car: { id: 1, plate: "ABC-1234" },
      } as Usage;

      const updatedUsage = { ...usage, ...updateData };

      const mockFindOne = jest
        .spyOn(usageRepository["repository"], "findOne")
        .mockResolvedValue(usage);
      const mockSave = jest
        .spyOn(usageRepository["repository"], "save")
        .mockResolvedValue(updatedUsage);

      const result = await usageService.updateUsage(id, updateData);

      expect(result).toEqual(updatedUsage);
      expect(mockFindOne).toHaveBeenCalledWith({
        relations: ["used_by", "used_car"],
        where: { id: 1 },
      });
      expect(mockSave).toHaveBeenCalledWith(
        expect.objectContaining({ end_date: updateData.endDate })
      );
    });

    it("should throw NotFoundException if utilization not found", async () => {
      const id = 1;
      const updateData: UpdateUsagePayload = { endDate: new Date() };

      jest
        .spyOn(usageRepository["repository"], "findOne")
        .mockResolvedValue(null);

      await expect(usageService.updateUsage(id, updateData)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("findAll", () => {
    it("should return all utilizations", async () => {
      const filter: FilterUsage = {
        driverName: "John Doe",
        carPlate: "ABC-1234",
      };

      const usage = {
        id: 1,
        start_date: new Date(),
        end_date: null,
        reason: "Business trip",
        used_by: { id: 1, name: "John Doe" },
        used_car: { id: 1, plate: "ABC-1234" },
      } as Usage;
      const mockFind = jest
        .spyOn(usageRepository["repository"], "find")
        .mockResolvedValue([usage]);

      const result = await usageService.findAll(filter);

      expect(result).toEqual([usage]);
      expect(mockFind).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            driver: { name: filter.driverName },
            car: { plate: filter.carPlate },
          },
        })
      );
    });
  });

  describe("findById", () => {
    it("should return a usage by id", async () => {
      const id = 1;

      const usage = {
        id,
        start_date: new Date(),
        end_date: null,
        reason: "Business trip",
        used_by: { id: 1, name: "John Doe" },
        used_car: { id: 1, plate: "ABC-1234" },
      } as Usage;

      const mockFindOne = jest
        .spyOn(usageRepository["repository"], "findOne")
        .mockResolvedValue(usage);
      const result = await usageService.findById(id);

      expect(result).toEqual(usage);
      expect(mockFindOne).toHaveBeenCalledWith({
        relations: ["used_by", "used_car"],
        where: { id: 1 },
      });
    });

    it("should throw NotFoundException if usage not found", async () => {
      const id = 1;

      jest
        .spyOn(usageRepository["repository"], "findOne")
        .mockResolvedValue(null);
      await expect(usageService.findById(id)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
