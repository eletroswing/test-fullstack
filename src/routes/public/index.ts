import { Router, Request, Response } from "express";
import { z } from "zod";

import errors from "../../../infra/errors";
import logger from "../../../infra/logger";

import validator from "../../validator";

import city from "../../adapters/city";
import state from "../../adapters/state";
import page from "../../adapters/page";
import cache from "../../../infra/cache";

const CacheSystem = new cache(process.env.REDIS as string);

const PublicRouter: Router = Router();

PublicRouter.get("/", async (request: Request, response: Response) => {
  try {
    const outputSchema = z.array(
      z.object({
        state: z.string(),
        state_id: z.string(),
      })
    );

    const cache = await CacheSystem.search(`rootpage-${request.query.page ? Number(request.query.page) : 1}`)
    if(cache) {
      return response.status(200).json({
        states: validator(outputSchema)(cache),
        total_pages: await state.getStatesPageCount(),
      });
    }

    const stateResult = await state.getAllStates(request.query.page ? Number(request.query.page) : 1);
    if (!stateResult || !stateResult.length)
      return errors.NotFoundError(response);

    await CacheSystem.save(`rootpage-${request.query.page ? Number(request.query.page) : 1}`, 3600, stateResult);

    return response.status(200).json({
      states: validator(outputSchema)(stateResult),
      total_pages: await state.getStatesPageCount(),
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

    const cache = await CacheSystem.search(`statepage-${request.params.stateId}/${request.query.page ? Number(request.query.page) : 1}`);
    if(cache) {
      return response.status(200).json({
        cities: validator(outputSchema)(cache),
        total_pages: await state.getStatesPageCount(),
      });
    }

    const cityResult = await city.getAllCityFromState(request.params.stateId, request.query.page ? Number(request.query.page) : 1);
    if (!cityResult || !cityResult.length)
      return errors.NotFoundError(response);

    await CacheSystem.save(`statepage-${request.params.stateId}/${request.query.page ? Number(request.query.page) : 1}`, 3600, cityResult);

    return response.status(200).json({
      cities: validator(outputSchema)(cityResult),
      total_pages: await city.getAllCityFromStatePageCount(request.params.stateId),
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

      const cache = await CacheSystem.search(`infopage-${request.params.stateId}:${request.params.cityId}`);
      if(cache) {
        return response.status(200).json(validator(outputSchema)(cache));
      }

      const pageResult = await page.getPage(
        request.params.stateId,
        request.params.cityId
      );
      if (!pageResult) return errors.NotFoundError(response);

      await CacheSystem.save(`infopage-${request.params.stateId}:${request.params.cityId}`, 10, pageResult);

      return response.status(200).json(validator(outputSchema)(pageResult));
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

      const cache = await CacheSystem.search(`article-${request.params.stateId}:${request.params.cityId}:${request.params.slug}`);  
      if(cache) {
        return response.status(200).json(validator(outputSchema)(cache));
      }

      const articleResult = await page.getArticle(
        request.params.stateId,
        request.params.cityId,
        request.params.slug
      );

      if (!articleResult) return errors.NotFoundError(response);

      await CacheSystem.save(`article-${request.params.stateId}:${request.params.cityId}:${request.params.slug}`, 10, articleResult);

      return response.status(200).json(validator(outputSchema)(articleResult));
    } catch (error) {
      logger.log(error);
      return errors.InternalServerError(response);
    }
  }
);


export default PublicRouter;
