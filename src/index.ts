//IMPORTS ======================================================
import Dotenv from "dotenv";
import Express from "express";
import { ClerkExpressWithAuth, LooseAuthProp } from "@clerk/clerk-sdk-node";

import cors from "cors";
import helmet from "helmet";

import Logger from "./../infra/logger";
import PublicRouter from "./routes/public";
import PrivateRouter from "./routes/private";

if (process.env.NODE_ENV !== "PRODUCTION") {
  Dotenv.config();
}

//Declare Globals to avoid clerk erros =========================
declare global {
  namespace Express {
    interface Request extends LooseAuthProp {}
  }
}

//CREATE INSTANCE ======================================================

const Instance: Express.Application = Express();

//DEFINE MIDDLEWARES ======================================================

Instance.use(Express.json());
Instance.use(
  cors({
    origin: "*",
  })
);
Instance.use(helmet());
Instance.use(ClerkExpressWithAuth({}));

//DEFINE ROUTES ========================================================

Instance.use("/public", PublicRouter);
Instance.use("/private", PrivateRouter);

//START ========================================================

Instance.listen(process.env.PORT, () => {
  Logger.log(`App running on port ${process.env.PORT}`);
});
