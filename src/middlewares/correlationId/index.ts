import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { HttpContext } from "../../pkgs/http-context";
import { CORRELATION_ID, HEADER_CORRELATION_ID } from "../../pkgs/constants";
import { StringExtension } from "../../pkgs/extensions/string";

export function correlationIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let correlationId = req.get(HEADER_CORRELATION_ID) as string;
  if (!correlationId) {
    correlationId = StringExtension.generateShortUuid();
  }
  res.setHeader(HEADER_CORRELATION_ID, correlationId);
  HttpContext.set(CORRELATION_ID, correlationId);
  next();
}
