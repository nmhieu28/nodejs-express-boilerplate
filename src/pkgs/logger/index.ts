import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { HttpContext } from "../http-context";
import { CORRELATION_ID } from "../constants";

const isDev = process.env.NODE_ENV === "development";

const dailyRotateTransport = new DailyRotateFile({
  dirname: path.resolve(process.cwd(), "logs"),
  filename: "omiboard-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "50m",
  maxFiles: "30d",
});

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    var correlationId = HttpContext.get(CORRELATION_ID);
    return `${timestamp} [${level.toLocaleUpperCase()}] ${
      correlationId ? `${correlationId}` : ""
    } ${message} ${stack ? stack : ""}`;
  })
);

const transports = [dailyRotateTransport] as any;

if (isDev) {
  transports.push(new winston.transports.Console());
}
const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: transports,
});

export default logger;
