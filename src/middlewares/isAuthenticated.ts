import { WithAuthProp } from "@clerk/clerk-sdk-node";
import { Response, Request, NextFunction } from "express";

import Errors from "./../../infra/errors";

export default (request: WithAuthProp<Request>, response: Response, next: NextFunction) => {
    if(request.auth.userId || process.env.NODE_ENV != "PRODUCTION") return next();

    return Errors.UnauthenticatedError(response);
};