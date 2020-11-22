import { Arg, Args, ArgsType, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import bcrypt from "bcrypt"
import { v4 } from 'uuid'
import { userService } from '../services/user.service'
import { User } from '../models/User'
import { isEmail, validatePassword } from "../utils/validations";
import { ApolloError } from "apollo-server-express";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { errorsProperties } from "../utils/errorValue";
import { HttpContext } from "../types";
import { sendEmail } from "../utils/sendEmail";

// When you have as many arguments as you can't list, use @ArgsType()
@ArgsType()
class EmailPasswordInput {
  @Field()
  email: string;

  @Field()
  password: string

  @Field({ nullable: true })
  confirmedPassword: string;
}

@ArgsType()
class PasswordInput {
  @Field()
  password: string

  @Field({ nullable: true })
  confirmedPassword: string;
}

@ArgsType()
class UserNameInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { req }: HttpContext
  ) {
    if (!req.session.userId) {
      return null
    }

    const user = await userService.findById(req.session.userId)
    return user
  }

  @Query(() => User, { nullable: true })
  async findBy() {
    
  }

  @Mutation(() => UserResponse)
  async register(
    @Args() { email, password, confirmedPassword }: EmailPasswordInput,
    @Args() { firstName, lastName } : UserNameInput,
    @Ctx() { req }: HttpContext
  ): Promise<UserResponse>  {
    try {
      if (!isEmail(email)) {
        return {
          errors: errorsProperties('email', 'Email is not valid')
        }
      }
      
      const passwordValidator = validatePassword(password, confirmedPassword)
      if (passwordValidator.isInvalid) {
        return {
          errors: errorsProperties('password', passwordValidator.description)
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      
      const user = await userService.create(firstName, lastName, email, hashedPassword)

      // store user id session
      // keep them logged in
      req.session.userId = user.id

      return { user }
    } catch (error) {
      if (error.code === '23505') {
        return {
          errors: errorsProperties('error', 'Email already existed')
        }
      } else {
        throw new ApolloError(error.message, error.code)
      }
    }
  }
  
  @Mutation(() => UserResponse)
  async login(
    @Args() { email, password } : EmailPasswordInput,
    @Ctx() { req }: HttpContext
  ): Promise<UserResponse> {
    try {
      const user = await userService.findBy({
        where: {
          email
        }
      })
  
      if (!user) {
        return {
          errors: errorsProperties('email', "email doesn't exist")
        }
      }
  
      const validPassword = await bcrypt.compare(password, user.password)

      if (!validPassword) {
        return {
          errors: errorsProperties('password', 'incorrect password.')
        }
      }

      req.session.userId = user.id

      return { user }
    } catch (error) {
      throw new ApolloError(error.message, error.code)
    }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: HttpContext) {
    return new Promise (resolve => req.session.destroy(err => {
      res.clearCookie(COOKIE_NAME);
      if (err) {
        resolve(false)
        return
      }
      resolve(true)
    }))
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: HttpContext
  ) {
    const user = await userService.findBy({
      where: {
        email
      }
    })

    if (!user) {
      return true
    }
    const token = v4()

    await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, 'ex', 60 * 30)    // 60 seconds * 30 miuntes
    await sendEmail(email, `<a href="http://localhost:3000/change-password/${token}">reset password</a>`)

    return true
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Args() { password, confirmedPassword }: PasswordInput,
    @Arg('token', { nullable: true }) token: string,
    @Ctx() { req, redis }: HttpContext
  ): Promise<UserResponse> {
    const passwordValidator = validatePassword(password, confirmedPassword)
    if(passwordValidator.isInvalid) {
      return {
        errors: errorsProperties('password', 'incorrect password.')
      }
    }

    const key = FORGET_PASSWORD_PREFIX + token
    const userId = await redis.get(key)

    if (userId === null) {
      return {
        errors: errorsProperties('tokenExpired', "I was waiting for you so long until you change the password. Would you mind changing the password again?")
      }
    }

    const user = await userService.findById(userId)

    user.password = await bcrypt.hash(password, 10)

    await redis.del(key)

    req.session.userId = userId
    
    return { user }
  }
}