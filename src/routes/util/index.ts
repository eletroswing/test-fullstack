import { Router, Request, Response } from "express";

import errors from "../../../infra/errors";
import logger from "../../../infra/logger";

import queue from "../../queue";

const UtilRouter: Router = Router();

UtilRouter.post(
  "/attorney/:stateId/:cityId/:cid",
  async (request: Request, response: Response) => {
    try {

      queue.add({
        type: "attorney_click",
        data: {
          state: request.params.stateId,
          city: request.params.cityId,
          cid: request.body.cid,
        },
      });

      return response.status(200).end();
    } catch (error) {
      logger.log(error);
      return errors.InternalServerError(response);
    }
  }
);

export default UtilRouter;
