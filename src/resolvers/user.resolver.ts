import { Arg, Args, ArgsType, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import bcrypt from "bcrypt"
import { userService } from '../services/user.service'
import { User } from '../models/User'
import { isEmail, validatePassword } from "../utils/validations";

@ArgsType()
class EmailPasswordInput {
  @Field()
  email: string;

  @Field()
  password: string

  @Field(() => String)
  confirmedPassword: string;
}

@ArgsType()
class UserNameInput {
  @Field()
  firstName: string;

  @Field(() => String)
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
    @Args() { firstName, lastName } : UserNameInput
  ): Promise<UserResponse>  {
    try {
      const passwordValidator = validatePassword(password, confirmedPassword)
      if (!isEmail) {
        return {
          errors: [{
            field: 'email',
            message: 'email is not valid'
          }]
        }
      }

      if (passwordValidator.isInvalid) {
        return {
          errors: [{
            field: 'password',
            message: passwordValidator.description
          }]
        }
      }

      let hashedPassword = '';
      bcrypt.hash(password, 20, (err, hash) => {
        hashedPassword = hash
      })
      
      const user = await userService.create(firstName, lastName, email, hashedPassword)

      return { user }
    } catch (error) {
      if (error.code === '23505') {
        return {
          errors: [{
            field: 'error',
            message: 'email already existed'
          }]
        }
      }
    }
  }
}