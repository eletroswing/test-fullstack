import { Response, Request, NextFunction } from "express";
import Dotenv from "dotenv";
Dotenv.config();

export default (request: Request, response: Response, next: NextFunction) => {
  return next();
};