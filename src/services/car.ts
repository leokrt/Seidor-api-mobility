import { Car } from "../entities/Car";
import { CarRepository } from "../repositories/car";
import { CarPayload, FilterCar, ICarService } from "../types/car";
import { BadRequestException, NotFoundException } from "../utils/errors";

export class CarService implements ICarService {
  private carRepository: CarRepository;

  constructor() {
    this.carRepository = new CarRepository();
  }

  private async validateCarWithPlate(plate: string): Promise<void> {
    const hasCarWithPlate = await this.carRepository.findOneBy({
      plate,
    });
    if (hasCarWithPlate) {
      throw new BadRequestException(409, "Plate already in use");
    }
  }

  async findAll(filter?: FilterCar): Promise<Car[]> {
    return this.carRepository.findAll(filter);
  }

  async findById(id: number): Promise<Car | null> {
    const result = await this.carRepository.findById(id);
    if (!result) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }

    return result;
  }

  async createCar(payload: CarPayload): Promise<Car> {
    await this.validateCarWithPlate(payload.plate);

    const car = new Car();
    Object.assign(car, payload);

    return this.carRepository.save(car);
  }

  async updateCar(id: number, updateData: Partial<Car>): Promise<Car | null> {
    if (updateData.plate) {
      await this.validateCarWithPlate(updateData.plate);
    }
    const car = await this.carRepository.findById(id);
    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }

    Object.assign(car, updateData);
    return this.carRepository.save(car);
  }

  async deleteCar(id: number): Promise<void> {
    const car = await this.carRepository.findById(id);
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    await this.carRepository.remove(id, car.plate);
  }
}
