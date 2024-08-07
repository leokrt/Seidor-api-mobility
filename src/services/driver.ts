import { Driver } from "../entities/Driver";
import { DriverRepository } from "../repositories/driver";
import { DriverPayload, FilterDriver, IDriverService } from "../types/driver";
import { BadRequestException, NotFoundException } from "../utils/errors";

export class DriverService implements IDriverService {
  private driverRepository: DriverRepository;

  constructor() {
    this.driverRepository = new DriverRepository();
  }

  private async validateNameExists(name: string): Promise<void> {
    const hasDriverWithName = await this.driverRepository.findOneBy({
      name,
    });
    if (hasDriverWithName) {
      throw new BadRequestException(409, "Name already in use");
    }
  }

  async findAll(filter?: FilterDriver): Promise<Driver[]> {
    return this.driverRepository.findAll(filter);
  }

  async findById(id: number): Promise<Driver | null> {
    const result = await this.driverRepository.findById(id);
    if (!result) {
      throw new NotFoundException(`Driver with id ${id} not found`);
    }

    return result;
  }

  async createDriver(payload: DriverPayload): Promise<Driver> {
    await this.validateNameExists(payload.name);

    const driver = new Driver();
    Object.assign(driver, payload);
    return this.driverRepository.save(driver);
  }

  async updateDriver(
    id: number,
    updateData: Partial<Driver>
  ): Promise<Driver | null> {
    const driver = await this.driverRepository.findById(id);
    if (!driver) {
      throw new NotFoundException(`Driver with id ${id} not found`);
    }
    await this.validateNameExists(updateData.name);

    Object.assign(driver, updateData);
    return this.driverRepository.save(driver);
  }

  async deleteDriver(id: number): Promise<void> {
    const driver = await this.driverRepository.findById(id);
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    await this.driverRepository.remove(id);
  }
}
