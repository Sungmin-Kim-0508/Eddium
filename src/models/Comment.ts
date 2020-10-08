import { ObjectType, Field } from "type-graphql"
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Timestamp } from "./Timestamp";
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
  userId: number;

  @Field()
  @ManyToOne(() => User, user => user.comments)
  user: User;

  @Column(_type => Timestamp)
  timestamp: Timestamp
} 