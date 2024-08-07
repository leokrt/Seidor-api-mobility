import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from "typeorm";
import { Driver } from "./Driver";
import { Car } from "./Car";

@Entity()
export class Usage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start_date: Date;

  @Column({ nullable: true })
  end_date: Date;

  @Column()
  reason: string;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: "used_by" })
  used_by: Driver;

  @ManyToOne(() => Car)
  @JoinColumn({ name: "used_car" })
  used_car: Car;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
