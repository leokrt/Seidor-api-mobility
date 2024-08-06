import { Repository } from "typeorm";
import { Car } from "../entities/Car";
import { PostgresDataSource } from "../config/data-source";

export class CarRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = PostgresDataSource.getRepository(Car);
  }

  async findAll(): Promise<Car[]> {
    return this.repository.find();
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
