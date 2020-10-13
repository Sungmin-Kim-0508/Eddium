import { ObjectType, Field } from "type-graphql"
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from "./User";

@ObjectType()
@Entity({ name: 'Comments' })
export class Comment {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255})
  comment: string;

  @Field()
  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.comments)
  user: User;

  @CreateDateColumn({ default: 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({ default: 'NOW()' })
  updatedAt: Date;
} 