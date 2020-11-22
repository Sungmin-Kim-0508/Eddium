import { ApolloError } from 'apollo-server-express'
import { INTERNAL_SERVER_ERROR } from '../types'
import { Story } from '../models/Story'

export const storyService = {
  findAllStoriesBy: (where?: object) => {
    try {
      const stories = Story.find(where)
      return stories
    } catch (error) {
      throw new ApolloError('storyService error findAllStoriesBy', INTERNAL_SERVER_ERROR)
    }
  },
  findAllStoriesByUserId: (userId: string) => {
    try {
      const stories = Story.find({ where: {
        userId
      }})
  
      return stories
    } catch (error) {
      throw new ApolloError('storyService error findAllStoriesByUserId', INTERNAL_SERVER_ERROR)
    }
  },
  findBy: (where: object) => {
    const story = Story.findOne(where, { relations: ["user"] })
      .then((story) => {
        if (story === undefined) {
          return new Error('Cannot find story')
        }
        return story;
      })
      .catch(err => {
        throw new Error(err)
      })
      return story
  },
  findById: (storyId: string) => {
    const story = Story.findOneOrFail({ where: {
      id: storyId
    }})
    return story
  },
  create: (title: string, content: string, userId: string, isPublished: boolean, thumbnail_image_url: string) => {
    return Story.create({
      title,
      content,
      userId,
      isPublished,
      thumbnail_image_url
    }).save()
  },
  update: (id: string, title: string, content: string, isPublished: boolean,thumbnail_image_url?: string) => {
    return Story.update(id, {
      title,
      content,
      isPublished,
      thumbnail_image_url
    })
  },
  delete: (where: { id: string, userId: string }) => {
    const deleteStory = Story.delete(where)
      .then(() => {
        return {
          isDelete: true,
          msg: 'Successfully delete story'
        }
      })
      .catch(() => {
        return {
          isDelete: false,
          msg: 'Successfully delete story'
        }
      })
      return deleteStory
  }
}