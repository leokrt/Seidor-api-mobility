import { Repository } from "typeorm";
import { PostgresDataSource } from "../config/data-source";
import { Usage } from "../entities/Usage";
import { FilterUsage } from "../types/usage";

export class UsageRepository {
  public repository: Repository<Usage>;

  constructor() {
    this.repository = PostgresDataSource.getRepository(Usage);
  }

  async findAll(filter: FilterUsage): Promise<Usage[]> {
    const findOptions: any = {
      relations: ["used_by", "used_car"],
    };

    if (filter.driverName || filter.carPlate) {
      findOptions.where = {};
      if (filter.driverName) {
        findOptions.where.driver = { name: filter.driverName };
      }
      if (filter.carPlate) {
        findOptions.where.car = { plate: filter.carPlate };
      }
    }

    return this.repository.find(findOptions);
  }

  async findById(id: number): Promise<Usage | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["used_by", "used_car"],
    });
  }

  async save(usage: Usage): Promise<Usage> {
    return this.repository.save(usage);
  }
}
