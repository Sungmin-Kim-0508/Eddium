import { ApolloError } from "apollo-server-express";
import { storyService } from "../services/story.service";
import { HttpContext } from "src/types";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Story } from "../models/Story";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class StoryResolver {

  @Query(() => [Story])
  async getAllStories(): Promise<Story[]> {
    try {
      const stories = await storyService.findAllStoriesBy({})
      return stories
    } catch (error) {
      throw new ApolloError('storyResolver error getAllStories')
    }
  }
  
  @Query(() => [Story])
  async getAllStoriesByUserId(
    @Arg('userId') userId: string
  ): Promise<Story[]> {
    try {
      const stories = await storyService.findAllStoriesByUserId(userId)
      return stories
    } catch (error) {
      throw new ApolloError('storyResolver error getAllStoriesByUserId')
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createStory(
    @Arg('title') title: string,
    @Arg('content') content: string,
    @Ctx() { req }: HttpContext
  ) {
    const userId = req.session.userId
    try {
      await storyService.create(title, content, userId)
      return true
    } catch (error) {
      throw new ApolloError(error.message, error.code)
    }
  }
}