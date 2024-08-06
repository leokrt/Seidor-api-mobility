import { Car } from "../entities/Car";
import { CarRepository } from "../repositories/car";
import { CarPayload, ICarService } from "../types/car";
import { BadRequestException, NotFoundException } from "../utils/errors";

export class CarService implements ICarService {
  private carRepository: CarRepository;

  constructor() {
    this.carRepository = new CarRepository();
  }

  async findAll(): Promise<Car[]> {
    return this.carRepository.findAll();
  }

  async findById(id: number): Promise<Car | null> {
    const result = await this.carRepository.findById(id);
    if (!result) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }

    return result;
  }

  async createCar(payload: CarPayload): Promise<Car> {
    const hasCarWithPlate = await this.carRepository.findOneBy({
      plate: payload.plate,
    });
    if (hasCarWithPlate) {
      throw new BadRequestException(409, "Plate already in use");
    }

    const car = new Car();
    Object.assign(car, payload);

    return this.carRepository.save(car);
  }

  async updateCar(id: number, updateData: Partial<Car>): Promise<Car | null> {
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
