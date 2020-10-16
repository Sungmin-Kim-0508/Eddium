import { Request, Response } from 'express'

export type HttpContext = {
  req: Request & { session: Express.Session };
  // req: Request;
  res: Response;
}