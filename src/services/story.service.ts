import { ApolloError } from 'apollo-server-express'
import { INTERNAL_SERVER_ERROR } from '../types'
import { Story } from '../models/Story'

export const storyService = {
  findAllStoriesBy: async (where?: object) => {
    try {
      const stories = await Story.find({ where })
      return stories
    } catch (error) {
      throw new ApolloError('storyService error findAllStoriesBy', INTERNAL_SERVER_ERROR)
    }
  },
  findAllStoriesByUserId: async (userId: string) => {
    try {
      const stories = await Story.find({ where: {
        userId
      }})
  
      return stories
    } catch (error) {
      throw new ApolloError('storyService error findAllStoriesByUserId', INTERNAL_SERVER_ERROR)
    }

  },
  findById: async (storyId: string) => {
    const story = await Story.findOneOrFail({ where: {
      id: storyId
    }})
    return story
  },
  create: async (title: string, content: string, userId: string) => {
    return Story.create({
      title,
      content,
      userId,
    }).save()
  }
}