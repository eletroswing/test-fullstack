import { Router, Request, Response } from "express";
import { z } from "zod";

import errors from "../../../infra/errors";
import logger from "../../../infra/logger";

import validator from "../../validator";

import city from "../../adapters/city";
import state from "../../adapters/state";
import page from "../../adapters/page";

const PublicRouter: Router = Router();

PublicRouter.get("/", async (request: Request, response: Response) => {
  try {
    const outputSchema = z.array(
      z.object({
        state: z.string(),
        state_id: z.string(),
      })
    );

    const stateResult = await state.getAllStates();
    if (!stateResult || !stateResult.length)
      return errors.NotFoundError(response);

    return response.status(200).json({
      states: validator(outputSchema)(stateResult),
    });
  } catch (error) {
    logger.log(error);
    return errors.InternalServerError(response);
  }
});

PublicRouter.get("/:stateId", async (request: Request, response: Response) => {
  try {
    const outputSchema = z.array(
      z.object({
        city: z.any(),
        city_id: z.any(),
      })
    );

    const cityResult = await city.getAllCityFromState(request.params.stateId);
    if (!cityResult || !cityResult.length)
      return errors.NotFoundError(response);

    return response.status(200).json({
      cities: validator(outputSchema)(cityResult),
    });
  } catch (error) {
    logger.log(error);
    return errors.InternalServerError(response);
  }
});

PublicRouter.get(
  "/:stateId/:cityId",
  async (request: Request, response: Response) => {
    try {
      const outputSchema = z.object({
        zips: z.string(),
        header: z.unknown(),
        articles: z.array(z.unknown()),
        faq: z.array(z.unknown()),
        reviews: z.array(z.unknown()),
        embedded_videos: z.array(z.unknown()),
        attorney: z.array(z.unknown()),
      });

      const pageResult = await page.getPage(
        request.params.stateId,
        request.params.cityId
      );
      if (!pageResult) return errors.NotFoundError(response);

      return response.status(200).json(validator(outputSchema)(pageResult));
    } catch (error) {
      logger.log(error);
      return errors.InternalServerError(response);
    }
  }
);

PublicRouter.post(
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

PublicRouter.get(
  "/:stateId/:cityId/:slug",
  async (request: Request, response: Response) => {
    try {
      const outputSchema = z.any();

      const articleResult = await page.getArticle(
        request.params.stateId,
        request.params.cityId,
        request.params.slug
      );

      if (!articleResult) return errors.NotFoundError(response);

      return response.status(200).json(validator(outputSchema)(articleResult));
    } catch (error) {
      logger.log(error);
      return errors.InternalServerError(response);
    }
  }
);


export default PublicRouter;
