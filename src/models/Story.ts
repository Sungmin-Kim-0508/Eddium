import { ObjectType, Field } from "type-graphql"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, UpdateDateColumn, OneToMany, BaseEntity } from 'typeorm'
import { SavedStory } from "./SavedStory";
import { User } from "./User";

@ObjectType()
@Entity({ name: 'Stories' })
export class Story extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  title: string;
  
  @Field()
  @Column()
  content: string;

  @Field()
  @Column({ type:'int', default: 0 })
  view: number;

  @Field()
  @Column({ type:'int', default: 0 })
  clap: number;

  @Field()
  @Column()
  userId: string;

  @Field()
  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Field()
  @Column({ default: '', nullable: true })
  thumbnail_image_url: string;

  @OneToMany(() => SavedStory, savedStory => savedStory.story)
  savedStories: SavedStory[];

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, user => user.stories)
  user: User;

  @Field(() =>  String)
  @CreateDateColumn({ default: 'NOW()' })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({ default: 'NOW()' })
  updatedAt: Date;
}