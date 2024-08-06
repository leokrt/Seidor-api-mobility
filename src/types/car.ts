import { Car } from "../entities/Car";

export type CarPayload = {
  plate: string;
  color: string;
  brand: string;
};

export type FilterCar = {
  brand?: string;
  color?: string;
};

export interface ICarService {
  findAll(filter: FilterCar): Promise<Car[]>;
  findById(id: number): Promise<Car | null>;
  createCar(payload: CarPayload): Promise<Car>;
  updateCar(id: number, updateData: Partial<Car>): Promise<Car | null>;
  deleteCar(id: number): Promise<void>;
}
