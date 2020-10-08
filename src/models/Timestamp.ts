import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export class Timestamp {
  @CreateDateColumn({ name: 'createdAt', default: 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', default: 'NOW()' })
  updatedAt: Date;
}