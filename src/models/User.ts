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

  @OneToMany(() => Story, story => story.user)
  stories: Story[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @ManyToMany(_type => SavedStory)
  @JoinTable({ name: 'UserSavedStories' })
  savedStories: SavedStory[];

  @CreateDateColumn({ default: 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({ default: 'NOW()' })
  updatedAt: Date;
}