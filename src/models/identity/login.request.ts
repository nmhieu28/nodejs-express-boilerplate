import { Request, Response, NextFunction } from "express";
import z from "zod";
import { StringExtension } from "../../pkgs/extensions/string";
import { GenericErrorCode } from "../../errors/generic.error";
import { failureResult } from "../../pkgs/response";

export const loginRequestSchema = z.object({
  email: z
    .string()
    .email("Please type a valid email.")
    .nonempty("email is required")
    .max(256, "Email is long character."),
  password: z
    .string()
    .nonempty("Password is required.")
    .min(8, "Password must be at least 8 characters."),
});
export function validateLoginRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.body = loginRequestSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json(
      failureResult(
        StringExtension.formatErrorCode(
          "GenericErrorCode",
          GenericErrorCode.INVALID_DATA
        ),
        error.errors.map((e) => e.message)
      )
    );
  }
}
export interface LoginRequest {
  email: string;
  password: string;
}
