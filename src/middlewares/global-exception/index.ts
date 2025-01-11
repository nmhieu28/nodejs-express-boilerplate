import { NextFunction, Request, Response } from "express";
import { failureResult } from "../../pkgs/response";
import { GenericErrorCode } from "../../errors/generic.error";
import { StringExtension } from "../../pkgs/extensions/string";

export function globalErrorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = error.status | 500;
  res
    .status(status)
    .json(
      failureResult(
        StringExtension.formatErrorCode(
          "GenericErrorCode",
          GenericErrorCode.INTERNAL_SERVER_ERROR
        ),
        "Internal Server Error"
      )
    );
}
