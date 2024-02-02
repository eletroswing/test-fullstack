//IMPORTS ======================================================
import Dotenv from "dotenv";
Dotenv.config();

import Express from "express";

import cors from "cors";

import Logger from "./../infra/logger";
import PublicRouter from "./routes/public";
import PrivateRouter from "./routes/private";
import UtilRouter from "./routes/util";

//CREATE INSTANCE ======================================================

const Instance: Express.Application = Express();

//DEFINE MIDDLEWARES ======================================================

Instance.use(Express.json());
Instance.use(
  cors({
    origin: "*",
  })
);

//DEFINE ROUTES ========================================================

Instance.use("/public", PublicRouter);
Instance.use("/private", PrivateRouter);
Instance.use("/util", UtilRouter);

//START ========================================================

Instance.listen(process.env.PORT, () => {
  Logger.log(`App running on port ${process.env.PORT}`);
});
