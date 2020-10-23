import { Arg, Args, ArgsType, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import bcrypt from "bcrypt"
import { userService } from '../services/user.service'
import { User } from '../models/User'
import { isEmail, validatePassword } from "../utils/validations";
import { ApolloError } from "apollo-server-express";
import { COOKIE_NAME } from "../constants";
import { errorsProperties } from "../utils/errorValue";
import { HttpContext } from "src/types";

// When you have as many arguments as you can't list, use @ArgsType()
@ArgsType()
class EmailPasswordInput {
  @Field(() => String!)
  email: string;

  @Field()
  password: string

  @Field(() => String!, { nullable: true })
  confirmedPassword: string;
}

@ArgsType()
class UserNameInput {
  @Field(() => String!)
  firstName: string;

  @Field(() => String!)
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

  @Query(() => String)
  hello(
    @Arg('name') name: string
  ) {
    return `Hello ${name}`
  }

  @Mutation(() => UserResponse)
  async register(
    @Args() { email, password, confirmedPassword }: EmailPasswordInput,
    @Args() { firstName, lastName } : UserNameInput,
    @Ctx() { req }: HttpContext
  ): Promise<UserResponse>  {
    try {
      if (!isEmail) {
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
}