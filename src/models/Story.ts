import { ObjectType, Field } from "type-graphql"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, UpdateDateColumn, OneToMany } from 'typeorm'
import { SavedStory } from "./SavedStory";
import { User } from "./User";

@ObjectType()
@Entity({ name: 'Stories' })
export class Story {
  @Field()
  @PrimaryGeneratedColumn("uuid")
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
  view: number;

  @Field()
  @Column({ type:'int', default: 0 })
  clap: number;

  @Field()
  @Column()
  userId: string;

  @OneToMany(() => SavedStory, savedStory => savedStory.story)
  savedStories: SavedStory[];

  @ManyToOne(() => User, user => user.stories)
  user: User;

  @Field(() =>  String)
  @CreateDateColumn({ default: 'NOW()' })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ default: 'NOW()' })
  updatedAt: Date;
}