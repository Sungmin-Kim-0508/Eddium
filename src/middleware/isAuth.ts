import { AuthenticationError } from "apollo-server-express"
import { MiddlewareFn } from "type-graphql"
import { HttpContext } from "../types"

export const isAuth: MiddlewareFn<HttpContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new AuthenticationError('Make sure you logged in')
  }
  return next()
}