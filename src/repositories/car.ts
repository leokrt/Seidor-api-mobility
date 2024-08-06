import { Repository } from "typeorm";
import { PostgresDataSource } from "../config/data-source";
import { Car } from "../entities/Car";
import { FilterCar } from "../types/car";

export class CarRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = PostgresDataSource.getRepository(Car);
  }

  async findAll(filter?: FilterCar): Promise<Car[]> {
    const where: FilterCar = {};
    if (filter?.color) {
      where.color = filter.color;
    }
    if (filter?.brand) {
      where.brand = filter.brand;
    }
    return this.repository.find({ where });
  }

  async findById(id: number): Promise<Car | null> {
    return this.repository.findOneBy({ id });
  }

  async findOneBy(conditions: {
    plate?: string;
    color?: string;
    brand?: string;
  }): Promise<Car | null> {
    return this.repository.findOneBy(conditions);
  }

  async save(car: Car): Promise<Car> {
    return this.repository.save(car);
  }

  async remove(id: number, plate: string): Promise<void> {
    await this.repository.softDelete({ id, plate });
  }
}
