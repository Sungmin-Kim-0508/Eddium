import { ObjectType, Field } from "type-graphql"
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from 'typeorm';
import { Story } from "./Story";
import { Comment } from "./Comment";
import { Timestamp } from "./Timestamp";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn({ type: "uuid" })
  id: string;
  
  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;

  @OneToMany(() => Story, story => story.user)
  stories: Story[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[]

  @Column(_type => Timestamp)
  timestamp: Timestamp
}