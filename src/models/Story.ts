import { ObjectType, Field } from "type-graphql"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, ManyToOne, UpdateDateColumn } from 'typeorm'
import { User } from "./User";

@ObjectType()
@Entity()
export class Story extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ type: "uuid" })
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  shortdesc: string;
  
  @Field()
  @Column()
  longdesc: string;

  @Field()
  @Column({ type:'int', default: 0 })
  view: number

  @Field()
  @Column({ type:'int', default: 0 })
  clap: number

  @Field()
  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.stories)
  user: User;

  @Field(() =>  String)
  @CreateDateColumn({ default: 'NOW()' })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ default: 'NOW()' })
  updatedAt: Date;
}