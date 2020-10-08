import { ObjectType, Field } from "type-graphql"
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from "./User";

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ type: "uuid" })
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255})
  comment: string;

  @Field()
  @Column()
  userId: string;

  @Field()
  @ManyToOne(() => User, user => user.comments)
  user: User;

  @CreateDateColumn({ default: 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({ default: 'NOW()' })
  updatedAt: Date;
} 