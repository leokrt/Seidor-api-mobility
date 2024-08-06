import { Driver } from "../../entities/Driver";
import { DriverRepository } from "../../repositories/driver";
import { DriverService } from "../../services/driver";
import { NotFoundException } from "../../utils/errors";

describe("Unit tests for Driver service", () => {
  jest.mock("typeorm", () => {
    const originalModule = jest.requireActual("typeorm");
    return {
      ...originalModule,
      Repository: jest.fn().mockImplementation(() => ({
        save: jest.fn(),
      })),
    };
  });
  let driverRepository: DriverRepository;
  let serviceDriver: DriverService;
  let driver: Driver;
  const driverPayload = {
    name: "John Doe",
  };

  beforeEach(() => {
    driverRepository = new DriverRepository();
    serviceDriver = new DriverService();

    driver = new Driver();
    driver.id = 1;
    driver.name = "John Doe";
  });

  describe("Creation of driver", () => {
    it("Should create a driver", async () => {
      const mockSave = jest
        .spyOn(driverRepository["repository"], "save")
        .mockResolvedValue(driver);
      jest
        .spyOn(driverRepository["repository"], "findOneBy")
        .mockResolvedValue(undefined);
      const result = await serviceDriver.createDriver(driverPayload);

      expect(result).toHaveProperty("id");
      expect(mockSave).toHaveBeenCalledWith(driverPayload);
    });

    it("should throw an error if the name is already in use", async () => {
      const mockFindByName = jest
        .spyOn(driverRepository["repository"], "findOneBy")
        .mockResolvedValue(driver);

      await expect(serviceDriver.createDriver(driverPayload)).rejects.toThrow(
        "Name already in use"
      );
      expect(mockFindByName).toHaveBeenCalledWith({
        name: driverPayload.name,
      });
    });
  });

  describe("Delete a driver", () => {
    it("should throw NotFoundException if the driver does not exist", async () => {
      jest
        .spyOn(driverRepository["repository"], "findOneBy")
        .mockResolvedValue(undefined);

      await expect(serviceDriver.deleteDriver(1)).rejects.toThrow(
        NotFoundException
      );
    });

    it("should delete the driver if it exists", async () => {
      jest
        .spyOn(driverRepository["repository"], "findOneBy")
        .mockResolvedValue(driver);
      const softDeleteByIdSpy = jest
        .spyOn(driverRepository["repository"], "softDelete")
        .mockResolvedValue(null);

      await serviceDriver.deleteDriver(1);

      expect(softDeleteByIdSpy).toHaveBeenCalledWith({
        id: 1,
      });
    });
  });

  describe("Retrieve a list of drivers", () => {
    it("should return all drivers without filters", async () => {
      const drivers: Driver[] = [driver, { ...driver, name: "Leonardo" }];
      jest
        .spyOn(driverRepository["repository"], "find")
        .mockResolvedValue(drivers);

      const result = await serviceDriver.findAll();

      expect(result).toEqual(drivers);
      expect(driverRepository["repository"].find).toHaveBeenCalledWith({
        where: {},
      });
    });

    it("should return filtered drivers by color and brand", async () => {
      const drivers: Driver[] = [driver];
      jest
        .spyOn(driverRepository["repository"], "find")
        .mockResolvedValue(drivers);

      const result = await serviceDriver.findAll({
        name: "John Doe",
      });

      expect(result).toEqual(drivers);
      expect(driverRepository["repository"].find).toHaveBeenCalledWith({
        where: {
          name: "John Doe",
        },
      });
    });
  });

  describe("Retrieve a driver by id", () => {
    it("should throw NotFoundException if the driver does not exist", async () => {
      jest
        .spyOn(driverRepository["repository"], "findOneBy")
        .mockResolvedValue(undefined);
      await expect(serviceDriver.findById(1)).rejects.toThrow(
        NotFoundException
      );
    });

    it("should return the driver if it exists", async () => {
      jest
        .spyOn(driverRepository["repository"], "findOneBy")
        .mockResolvedValue(driver);

      const result = await serviceDriver.findById(1);

      expect(result).toEqual(driver);
    });
  });

  describe("Update a Driver", () => {
    it("should throw NotFoundException if the driver does not exist", async () => {
      jest
        .spyOn(driverRepository["repository"], "findOneBy")
        .mockResolvedValue(undefined);

      await expect(
        serviceDriver.updateDriver(1, { name: "Leo" })
      ).rejects.toThrow(NotFoundException);
    });

    it("should return the updated driver if it exists", async () => {
      jest
        .spyOn(driverRepository["repository"], "findOneBy")
        .mockResolvedValue(driver);
      const mockSave = jest
        .spyOn(driverRepository["repository"], "save")
        .mockResolvedValue({ ...driver, name: "Leo" });

      const result = await serviceDriver.updateDriver(1, { name: "Leo" });

      expect(result.name).toBe("Leo");
      expect(mockSave).toHaveBeenCalledWith({ ...driver, name: "Leo" });
    });
  });
});
