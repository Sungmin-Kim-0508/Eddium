import { ApolloError, AuthenticationError, GraphQLUpload } from "apollo-server-express";
import { storyService } from "../services/story.service";
import { HttpContext, UploadedFileResponse, UploadFile } from "../types";
import { Arg, Args, ArgsType, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
// import { GraphQLUpload, FileUpload } from 'graphql-upload'
import { Story } from "../models/Story";
import { isAuth } from "../middleware/isAuth";
import { imageService } from "../services/image.service";

@ObjectType()
class DeleteResponse {
  @Field(() => Boolean)
  isDelete: boolean;

  @Field(() => String)
  msg: String
}

@ArgsType()
class FindStoryBy {
  @Field(() => String, { nullable: true })
  id?: string;
  
  @Field(() => String, { nullable: true })
  title?: string;
}

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
  @UseMiddleware(isAuth)
  async getAllStoriesByUserId(
    @Arg('userId') userId: string,
    @Arg('isPublished', { nullable: true }) isPublished: boolean = false
  ): Promise<Story[]> {
    try {
      let stories = await storyService.findAllStoriesByUserId(userId)
      stories = isPublished ? stories.filter(story => story.isPublished) : stories.filter(story => story.isPublished === false)
      return stories
    } catch (error) {
      throw new ApolloError('storyResolver error getAllStoriesByUserId')
    }
  }

  @Query(() => [Story])
  @UseMiddleware(isAuth)
  async getAllStoriesByMe(
    @Arg('isPublished', { nullable: true }) isPublished: boolean = false,
    @Ctx() { req }: HttpContext
  ) {
    try {
      if (!req.session.userId) {
        return new AuthenticationError('You must be logged in')
      }
      const me = req.session.userId
      let stories = await storyService.findAllStoriesByUserId(me)
      stories = isPublished ? stories.filter(story => story.isPublished) : stories.filter(story => story.isPublished === false)
      return stories
    } catch (error) {
      throw new ApolloError('storyResolver error getAllStoriesByMe')
    }
  }

  @Query(() => Story)
  async getStoryBy(
    @Args() where: FindStoryBy
  ): Promise<Story | Error> {
    try {
      const story = await storyService.findBy(where)
      return story
    } catch (error) {
      throw new ApolloError('storyResolver error getStoryBy' + error)
    }
  }

  @Mutation(() => Story)
  @UseMiddleware(isAuth)
  async createStory(
    @Arg('title') title: string = '',
    @Arg('content') content: string = '',
    @Arg('imgUrl', () => String!, { nullable: true }) imgUrl : string = '',
    @Arg('isPublished') isPublished: boolean = false,
    @Ctx() { req }: HttpContext
  ) {
    const userId = req.session.userId
    try {
      // const { url } = await imageService.createThumbnail(image)
      const story = await storyService.create(title, content, userId, isPublished, imgUrl)
      req.session.storyId = story.id
      return story
    } catch (error) {
      throw new ApolloError('storyResolver error createStory' + error.message)
    }
  }

  @Mutation(() => Story, { nullable: true })
  @UseMiddleware(isAuth)
  async updateStory(
    @Arg('id', () => String) id: string,
    @Arg('title') title: string,
    @Arg('content') content: string,
    @Arg('imgUrl', () => String!, { nullable: true }) imgUrl : string = '',
    @Arg('isPublished') isPublished: boolean = false,
  ) {
    try {
      const story = await storyService.update(id, title, content,isPublished, imgUrl)
      return story.raw[0]
    } catch (error) {
      throw new ApolloError('storyResolver error updatePost ' + error)
    }
  }

  @Mutation(() => DeleteResponse)
  @UseMiddleware(isAuth)
  async deleteStory(
    @Arg('id', () => String) id: string,
    @Ctx() { req }: HttpContext
  ) : Promise<DeleteResponse> {
    try {
      return await storyService.delete({ id, userId: req.session.userId })
    } catch (error) {
      throw new ApolloError('storyResolver error deletePost ' + error)
    }
  }

  @Mutation(() => UploadedFileResponse)
  async createThumnail(
    @Arg('image', () => GraphQLUpload!) image : UploadFile
  ) : Promise<UploadedFileResponse> {
    try {
      return await imageService.createThumbnail(image)
    } catch (error) {
      throw new Error('storyResover error createThumnail ' + error)
    }
  }
}
