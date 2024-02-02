import { Response, Request, NextFunction } from "express";
import { AnyZodObject } from "zod";

import Errors from "./../../infra/errors";

export default (schema: AnyZodObject) => async (request: Request, response: Response, next: NextFunction) => {
    try {
        await schema.parseAsync(request.body);
        return next();
      } catch (error: any) {
        return Errors.UnprocessableEntityError(response, error);
      }
};