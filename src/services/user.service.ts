import { User } from '../models/User';


export const userService = {
  findBy: (where: object) => {
    return User.find({ where })
  },
  findById: (userId: string) => {
    return User.find({ where: {
      id: userId
    }})
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