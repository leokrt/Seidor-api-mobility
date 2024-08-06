import { Repository } from "typeorm";
import { PostgresDataSource } from "../config/data-source";
import { Driver } from "../entities/Driver";
import { FilterDriver } from "../types/driver";

export class DriverRepository {
  private repository: Repository<Driver>;

  constructor() {
    this.repository = PostgresDataSource.getRepository(Driver);
  }

  async findAll(filter?: FilterDriver): Promise<Driver[]> {
    const where: FilterDriver = {};
    if (filter?.name) {
      where.name = filter.name;
    }

    return this.repository.find({ where });
  }

  async findById(id: number): Promise<Driver | null> {
    return this.repository.findOneBy({ id });
  }

  async findOneBy(conditions: { name?: string }): Promise<Driver | null> {
    return this.repository.findOneBy(conditions);
  }

  async save(driver: Driver): Promise<Driver> {
    return this.repository.save(driver);
  }

  async remove(id: number): Promise<void> {
    await this.repository.softDelete({ id });
  }
}
