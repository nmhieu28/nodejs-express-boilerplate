import { NextFunction, Request, Response } from "express";
import { IdentityErrorCode } from "../../errors/identity.error";
import { StringExtension } from "../../pkgs/extensions/string";
import { failureResult } from "../../pkgs/response";
import { JwtTokenHandler } from "../../pkgs/jwt";
import { HttpContext } from "../../pkgs/http-context";
import { HTTP_CONTEXT } from "../../pkgs/constants";
import { appSettings } from "../../configs/config";

export async function AuthenticateJWTMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const authHeader = req.get("Authorization") as string;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401);
  }
  const token = authHeader.split(" ")[1];
  const tokenHandler = new JwtTokenHandler();

  const { payload, valid } = tokenHandler.verifyToken(
    token,
    appSettings.jwt.secretKey
  );

  if (!valid) {
    return res
      .status(401)
      .json(
        failureResult(
          StringExtension.formatErrorCode(
            "IdentityErrorCode",
            IdentityErrorCode.TokenInValid
          ),
          IdentityErrorCode[IdentityErrorCode.TokenInValid]
        )
      );
  }
  HttpContext.set(HTTP_CONTEXT.USER, payload);
  next();
}
