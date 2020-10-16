import { User } from '../models/User';


export const userService = {
  findBy: async (where: object) => {
    const user = await User.find(where)
    return user[0]
  },
  findById: async (userId: string) => {
    const user = await User.find({ where: {
      id: userId
    }})
    return user[0]
  },
  findAll: () => {
    return User.find({})
  },
  create: (firstName: string, lastName: string, email: string, password: string) => {
    return User.create({
      firstName,
      lastName, 
      email,
      password
    }).save()
  }
}