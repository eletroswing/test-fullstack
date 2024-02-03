import { Response, Request, NextFunction } from "express";
import Dotenv from "dotenv";
import { WithAuthProp } from "@clerk/clerk-sdk-node";
import errors from "../../infra/errors";
Dotenv.config();

export default async (request: WithAuthProp<Request>, response: Response, next: NextFunction) => {
  if(process.env.NODE_ENV != "PRODUCTION") return next();

  if(request.auth.userId) return next();

  errors.UnauthenticatedError(response);
};