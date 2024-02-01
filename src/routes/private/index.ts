import { Router, Request, Response } from "express";
import { z } from "zod";

import errors from "../../../infra/errors";
import logger from "../../../infra/logger";

import isAuthenticated from "../../middlewares/isAuthenticated";
import zodInputValidation from "../../middlewares/zodInputValidation";

import page from "../../adapters/page";
import { configDotenv } from "dotenv";

const PrivateRoute: Router = Router();

PrivateRoute.use(isAuthenticated);

PrivateRoute.patch(
  "/:stateId/:cityId/header",
  zodInputValidation(z.object({ image: z.string(), title: z.string() })),
  async (request: Request, response: Response) => {
    try {
      const pageResult = await page.getPage(
        request.params.stateId,
        request.params.cityId
      );
      if (!pageResult) return errors.NotFoundError(response);

      await page.updateHeader(
        request.params.stateId,
        request.params.cityId,
        request.body.image,
        request.body.title
      );
      return response.status(200).end();
    } catch (error) {
      logger.log(error);
      return errors.InternalServerError(response);
    }
  }
);

PrivateRoute.patch(
  "/:stateId/:cityId/zips",
  zodInputValidation(
    z.object({
      zips: z.string({
        required_error: "zips value is necessary to access this route",
      }),
    })
  ),
  async (request: Request, response: Response) => {
    try {
      const pageResult = await page.getPage(
        request.params.stateId,
        request.params.cityId
      );
      if (!pageResult) return errors.NotFoundError(response);

      await page.updateZips(
        request.params.stateId,
        request.params.cityId,
        request.body.zips
      );
      return response.status(200).end();
    } catch (error) {
      logger.log(error);
      return errors.InternalServerError(response);
    }
  }
);

PrivateRoute.patch(
  "/:stateId/:cityId/faqs",
  zodInputValidation(
    z.object({
      faqs: z.array(
        z.object({
          title: z.string({
            required_error:
              "faqs[i].title value is necessary to access this route",
          }),
          content: z.string({
            required_error:
              "faqs[i].title value is necessary to access this route",
          }),
        }),
        {
          required_error: "faqs value is necessary to access this route",
          invalid_type_error: "faqs must be an array",
        }
      ),
    })
  ),
  async (request: Request, response: Response) => {
    try {
      const pageResult = await page.getPage(
        request.params.stateId,
        request.params.cityId
      );
      if (!pageResult) return errors.NotFoundError(response);

      await page.updateFaqs(
        request.params.stateId,
        request.params.cityId,
        request.body.faqs
      );
      return response.status(200).end();
    } catch (error) {
      logger.log(error);
      return errors.InternalServerError(response);
    }
  }
);

PrivateRoute.patch(
  "/:stateId/:cityId/reviews",
  zodInputValidation(
    z.object({
      reviews: z.array(
        z.object({
          username: z.string({
            required_error:
              "reviews[i].username value is necessary to access this route",
          }),
          image: z.string({
            required_error:
              "reviews[i].image value is necessary to access this route",
          }),
          content: z.string({
            required_error:
              "reviews[i].content value is necessary to access this route",
          }),
          stars: z
            .number({
              required_error:
                "reviews[i].stars value is necessary to access this route",
            })
            .min(0.0, { message: "Mininum of 0.0 stars." })
            .max(5.0, { message: "Max of 5.0 stars." })
            .transform((value) => parseFloat(value.toFixed(1))),
          created_at: z.coerce.date({
            required_error:
              "reviews[i].created_at value is necessary to access this route",
          }),
          user_exists_from: z.coerce.date({
            required_error:
              "reviews[i].user_exists_from value is necessary to access this route",
          }),
        }),
        {
          required_error: "reviews value is necessary to access this route",
          invalid_type_error: "reviews must be an array",
        }
      ),
    })
  ),
  async (request: Request, response: Response) => {
    try {
      const pageResult = await page.getPage(
        request.params.stateId,
        request.params.cityId
      );
      if (!pageResult) return errors.NotFoundError(response);

      await page.updateReviews(
        request.params.stateId,
        request.params.cityId,
        request.body.reviews
      );
      return response.status(200).end();
    } catch (error) {
      logger.log(error);
      return errors.InternalServerError(response);
    }
  }
);

PrivateRoute.patch(
  "/:stateId/:cityId/embedded",
  zodInputValidation(
    z.object({
      embedded: z.array(
        z.object({
          url: z
            .string({
              required_error:
                "embedded[i].url value is necessary to access this route",
            })
            .url("embedded[i].url must be an url"),
          provider: z
            .string({
              required_error:
                "embedded[i].provider value is necessary to access this route",
            })
            .regex(/^(youtube|tiktok)$/, {
              message: "plataform must be youtube or tiktok",
            }),
        }),
        {
          required_error: "embedded value is necessary to access this route",
          invalid_type_error: "embedded must be an array",
        }
      ),
    })
  ),
  async (request: Request, response: Response) => {
    try {
      const pageResult = await page.getPage(
        request.params.stateId,
        request.params.cityId
      );
      if (!pageResult) return errors.NotFoundError(response);

      await page.updateembeddedVideos(
        request.params.stateId,
        request.params.cityId,
        request.body.embedded
      );
      return response.status(200).end();
    } catch (error) {
      logger.log(error);
      return errors.InternalServerError(response);
    }
  }
);

PrivateRoute.patch(
  "/:stateId/:cityId/attorney",
  zodInputValidation(
    z.object({
      attorney: z.array(
        z.object({
          cid: z.string({
            required_error:
              "attorney[i].cid value is necessary to access this route",
          }),
          name: z.string({
            required_error:
              "attorney[i].name value is necessary to access this route",
          }),
          address: z.string({
            required_error:
              "attorney[i].address value is necessary to access this route",
          }),
          phone: z.string({
            required_error:
              "attorney[i].phone value is necessary to access this route",
          }),
          website: z
            .string({
              required_error:
                "attorney[i].website value is necessary to access this route",
            })
            .url("attorney[i].website must be an url"),
          description: z
            .string({
              required_error:
                "attorney[i].description value is necessary to access this route",
            })
            .max(250, "attorney[i].description can have 250 characters."),
        }),
        {
          required_error: "attorney value is necessary to access this route",
          invalid_type_error: "attorney must be an array",
        }
      ),
    })
  ),
  async (request: Request, response: Response) => {
    try {
      const pageResult = await page.getPage(
        request.params.stateId,
        request.params.cityId
      );
      if (!pageResult) return errors.NotFoundError(response);

      await page.updateAttorney(
        request.params.stateId,
        request.params.cityId,
        request.body.attorney
      );
      return response.status(200).end();
    } catch (error) {
      logger.log(error);
      return errors.InternalServerError(response);
    }
  }
);

PrivateRoute.patch(
    "/:stateId/:cityId/article",
    zodInputValidation(
      z.object({
        articles: z.array(
          z.object({
            title: z.string({
              required_error:
                "article[i].title value is necessary to access this route",
            }),
            text: z.string({
              required_error:
                "article[i].text value is necessary to access this route",
            }),
            created_at: z.coerce.date({
              required_error:
                "article[i].created_at value is necessary to access this route",
            }),
            slug: z
              .string({
                required_error:
                  "article[i].slug value is necessary to access this route",
              })
              .url("article[i].slug must be an url"),
            image: z
              .string({
                required_error:
                  "article[i].image value is necessary to access this route",
              })
          }),
          {
            required_error: "article value is necessary to access this route",
            invalid_type_error: "article must be an array",
          }
        ),
      })
    ),
    async (request: Request, response: Response) => {
      try {
        const pageResult = await page.getPage(
          request.params.stateId,
          request.params.cityId
        );
        if (!pageResult) return errors.NotFoundError(response);
  
        await page.updateArticles(
          request.params.stateId,
          request.params.cityId,
          request.body.articles
        );
        return response.status(200).end();
      } catch (error) {
        logger.log(error);
        return errors.InternalServerError(response);
      }
    }
  );

export default PrivateRoute;
