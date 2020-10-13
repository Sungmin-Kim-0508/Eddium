import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Story } from "./Story";

@ObjectType()
@Entity({ name: 'SavedStories' })
export class SavedStory {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  storyId: string;

  @ManyToOne(() => Story, story => story.savedStories)
  story: Story;

  @CreateDateColumn({ default: 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({ default: 'NOW()' })
  updatedAt: Date;
}