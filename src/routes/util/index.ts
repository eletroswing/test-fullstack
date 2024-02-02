import { Router, Request, Response } from "express";

import errors from "../../../infra/errors";
import logger from "../../../infra/logger";

import page from "../../adapters/page";

const UtilRouter: Router = Router();

UtilRouter.post(
  "/attorney/:stateId/:cityId/:cid",
  async (request: Request, response: Response) => {
    try {
      const pageResult = await page.updateAttorneyClick(
        request.params.stateId,
        request.params.cityId,
        request.params.cid
      );
      if (!pageResult) return errors.NotFoundError(response);

      return response.status(200).end();
    } catch (error) {
      logger.log(error);
      return errors.InternalServerError(response);
    }
  }
);

export default UtilRouter;
