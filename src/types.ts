import { Request, Response } from 'express'
import { ReadStream } from 'fs'
import { Redis } from "ioredis"
import { Field, ObjectType } from 'type-graphql'


export type HttpContext = {
  req: Request & { session: Express.Session };
  redis: Redis;
  res: Response;
}

export type UploadFile = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream(): ReadStream;
}

@ObjectType()
export class UploadedFileResponse {
  @Field(() => Boolean)
  success: boolean;
  
  @Field(() => String)
  message: string;

  @Field(() => String)
  filename: string;

  @Field(() => String)
  mimetype: string;

  @Field(() => String)
  encoding: string;

  @Field(() => String)
  url: string;
}


export const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"