import express, { Application, Router } from "express";
import { appDataSource } from "./database/app.datasource";
import { correlationIdMiddleware } from "./middlewares/correlationId";
import { HttpContext } from "./pkgs/http-context";
import { appSettings } from "./configs/config";
import { autheRedisClient, redisClient } from "./pkgs/redis";
import cookieParser from "cookie-parser";
import { appRoutes } from "./controllers";
import cors from "cors";

const app: Application = express();
const corsOptions = {
  origin: appSettings.cors.allows,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
const connectDatabase = async function () {
  appDataSource
    .initialize()
    .then(() => console.log("Data Source has been initialized!"))
    .catch((err) =>
      console.log("Error during Data Source initialization: ", err)
    );
};
const initRoutes = function (routes: Record<string, Router>) {
  try {
    for (const [key, router] of Object.entries(routes)) {
      app.use(key, router);
    }
  } catch (err) {}
};
const connectRedis = async () => {
  redisClient
    .connect()
    .then(() => {
      console.log("redisClient connected");
    })
    .catch((err) => {
      console.error("Error connecting to Redis:", err);
    });
  autheRedisClient
    .connect()
    .then(() => {
      console.log("autheRedisClient connected");
    })
    .catch((err) => {
      console.error("Error connecting to Redis:", err);
    });
};
const useMiddleware = () => {
  app.use(express.json({ limit: "900mb" }));
  app.use(express.urlencoded({ limit: "900mb", extended: false }));
  app.use(cookieParser());
  app.use(HttpContext.middleware);
  app.use(correlationIdMiddleware);
  app.use(cors(corsOptions));
};

const Startup = async (): Promise<void> => {
  useMiddleware();
  initRoutes(appRoutes);
  connectDatabase();
  await connectRedis();
  app.listen(appSettings.service.port, (err) => {
    if (err) {
      console.log("Server start fail: ", err);
    } else console.log("server is running on port: ", appSettings.service.port);
  });
};

export default Startup;
