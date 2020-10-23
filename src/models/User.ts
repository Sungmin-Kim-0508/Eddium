import { ObjectType, Field } from "type-graphql"
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, BaseEntity } from 'typeorm';
import { Story } from "./Story";
import { Comment } from "./Comment";
import { SavedStory } from "./SavedStory";

@ObjectType({ description: 'This is User model' })
@Entity({ name: 'Users' })
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;
  
  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  password: string;

  @Field(_type => [Story], { nullable: true })
  @OneToMany(() => Story, story => story.user)
  stories: Story[];

  @Field(_type => [Comment], { nullable: true })
  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @Field(_type => [SavedStory], { nullable: true })
  @ManyToMany(_type => SavedStory)
  @JoinTable({ name: 'UserSavedStories' })
  savedStories: SavedStory[];

  @CreateDateColumn({ default: 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({ default: 'NOW()' })
  updatedAt: Date;
}