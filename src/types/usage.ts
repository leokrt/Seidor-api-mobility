import { Usage } from "../entities/Usage";

export interface UsagePayload {
  startDate: Date;
  reason: string;
  driverId: number;
  carId: number;
}

export interface UpdateUsagePayload {
  endDate: Date;
}

export interface FilterUsage {
  driverName?: string;
  carPlate?: string;
}

export interface IUsageService {
  findAll(filter: FilterUsage): Promise<Usage[]>;
  findById(id: number): Promise<Usage | null>;
  createUsage(payload: UsagePayload): Promise<Usage>;
  updateUsage(
    id: number,
    updateData: UpdateUsagePayload
  ): Promise<Usage | null>;
}
