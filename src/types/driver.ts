import { Driver } from "../entities/Driver";

export type DriverPayload = {
  name: string;
};

export type FilterDriver = {
  name?: string;
};

export interface IDriverService {
  findAll(filter: FilterDriver): Promise<Driver[]>;
  findById(id: number): Promise<Driver | null>;
  createDriver(payload: DriverPayload): Promise<Driver>;
  updateDriver(id: number, updateData: Partial<Driver>): Promise<Driver | null>;
  deleteDriver(id: number): Promise<void>;
}
