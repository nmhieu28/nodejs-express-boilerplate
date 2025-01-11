import { Request, Response, NextFunction } from "express";
import z from "zod";
import { StringExtension } from "../../pkgs/extensions/string";
import { GenericErrorCode } from "../../errors/generic.error";
import { failureResult } from "../../pkgs/response";

export const createUserRequestSchema = z.object({
  email: z
    .string()
    .nonempty("email is required")
    .max(256, "Email is long character."),
  password: z
    .string()
    .nonempty("Password is required.")
    .min(8, "Password must be at least 8 characters."),
  firstName: z.string().nonempty("firstName is required."),
  lastName: z.string().nonempty("lastName is required."),
});
export function validateCreateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.body = createUserRequestSchema.parse(req.body);
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
export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
