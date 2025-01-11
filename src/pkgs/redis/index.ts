import { appSettings } from "../../configs/config";
import { REDIS_DATABASE_NUMBER } from "../constants";
import { RedisClient, RedisConfig } from "./redis-client";

export const redisClient = new RedisClient(appSettings.redis);
export const autheRedisClient = new RedisClient(
  appSettings.redis,
  REDIS_DATABASE_NUMBER.IDENTITY
);
