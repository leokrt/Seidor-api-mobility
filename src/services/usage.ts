import { Usage } from "../entities/Usage";
import { UsageRepository } from "../repositories/usage";
import {
  UsagePayload,
  UpdateUsagePayload,
  FilterUsage,
  IUsageService,
} from "../types/usage";
import { BadRequestException, NotFoundException } from "../utils/errors";
import { DriverService } from "./driver";
import { CarService } from "./car";
import { IsNull, LessThanOrEqual, MoreThan, MoreThanOrEqual } from "typeorm";

export class UsageService implements IUsageService {
  private usageRepository: UsageRepository;
  private driverService: DriverService;
  private carService: CarService;

  constructor() {
    this.usageRepository = new UsageRepository();
    this.driverService = new DriverService();
    this.carService = new CarService();
  }

  async checkAvailability(
    carId: number,
    driverId: number,
    startDate: Date
  ): Promise<void> {
    const carUsage = await this.usageRepository.repository.findOne({
      where: [
        {
          used_car: { id: carId },
          end_date: MoreThanOrEqual(startDate),
        },
        {
          used_car: { id: carId },
          start_date: LessThanOrEqual(startDate),
          end_date: IsNull(),
        },
      ],
    });

    const driverUsage = await this.usageRepository.repository.findOne({
      where: [
        {
          used_by: { id: driverId },
          start_date: LessThanOrEqual(startDate),
          end_date: MoreThanOrEqual(startDate),
        },
        {
          used_by: { id: driverId },
          start_date: LessThanOrEqual(startDate),
          end_date: IsNull(),
        },
      ],
    });

    if (carUsage || driverUsage) {
      throw new BadRequestException(
        409,
        "Car already in use or driver has another car in use"
      );
    }
  }

  async createUsage(payload: UsagePayload): Promise<Usage> {
    const driver = await this.driverService.findById(payload.driverId);
    if (!driver) {
      throw new NotFoundException(
        `Driver with id ${payload.driverId} not found`
      );
    }

    const car = await this.carService.findById(payload.carId);
    if (!car) {
      throw new NotFoundException(`Car with id ${payload.carId} not found`);
    }

    await this.checkAvailability(
      payload.carId,
      payload.driverId,
      payload.startDate
    );
    const usage = new Usage();
    usage.start_date = payload.startDate;
    usage.reason = payload.reason;
    usage.used_by = driver;
    usage.used_car = car;

    return this.usageRepository.save(usage);
  }

  async updateUsage(
    id: number,
    updateData: UpdateUsagePayload
  ): Promise<Usage | null> {
    const usage = await this.usageRepository.findById(id);
    if (!usage) {
      throw new NotFoundException(`Usage with id ${id} not found`);
    }

    usage.end_date = updateData.endDate;
    return this.usageRepository.save(usage);
  }

  async findAll(filter: FilterUsage): Promise<Usage[]> {
    return this.usageRepository.findAll(filter);
  }

  async findById(id: number): Promise<Usage | null> {
    const result = await this.usageRepository.findById(id);
    if (!result) {
      throw new NotFoundException(`Usage with id ${id} not found`);
    }

    return result;
  }
}
