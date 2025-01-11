import { Request, Response } from "express";
import { IdentityService } from "../../features/identity/service/identity.service";
import logger from "../../pkgs/logger";
import { isSuccess, successResult } from "../../pkgs/response";
import { CreateUserRequest } from "../../models/identity/create-user.request";
import { LoginRequest } from "../../models/identity/login.request";
import { appSettings } from "../../configs/config";

const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = req.body as CreateUserRequest;
    const result = await IdentityService.register(user);
    if (isSuccess(result)) return res.json(result);
    else return res.status(400).json(result);
  } catch (err: any) {
    logger.error(`Can't register user, have a error: ${err.message}`);
    throw err;
  }
};
const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = req.body as LoginRequest;
    const result = await IdentityService.login(user);
    if (isSuccess(result)) {
      const refreshToken = result.data.refreshToken;
      const accessToken = result.data.token;
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: result.data.refreshTokenExpire, // miliseconds
      });
      return res.json(
        successResult({
          accessToken: accessToken,
        })
      );
    } else return res.status(401).json(result);
  } catch (err: any) {
    logger.error(`Can't register user, have a error: ${err.message}`);
    throw err;
  }
};
const verify = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, code } = req.body;
    const result = await IdentityService.verify(email, code);
    if (isSuccess(result)) return res.json(result);
    else return res.status(400).json(result);
  } catch (err: any) {
    logger.error(`Can't verify user, have a error: ${err.message}`, err.stack);
    throw err;
  }
};
const refreshToken = async (req: Request, res: Response): Promise<any> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const result = await IdentityService.refreshToken(refreshToken);
    if (isSuccess(result)) {
      res.cookie("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: appSettings.jwt.refreshTokenExpire,
      });
      return res.json(successResult({ accessToken: result.data.accessToken }));
    } else return res.status(401).json(result);
  } catch (err: any) {
    logger.error(`Can't verify user, have a error: ${err.message}`, err.stack);
    throw err;
  }
};
const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    const result = await IdentityService.forgotPassword(email);
    if (isSuccess(result)) return res.json(result);
    else return res.status(400).json(result);
  } catch (err: any) {
    logger.error(
      `Can't forgot passoword, have a error: ${err.message}`,
      err.stack
    );
    throw err;
  }
};
const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, code, password } = req.body;
    const result = await IdentityService.resetPassword(email, code, password);
    if (isSuccess(result)) return res.json(result);
    else return res.status(400).json(result);
  } catch (err: any) {
    logger.error(
      `Can't forgot password, have a error: ${err.message}`,
      err.stack
    );
    throw err;
  }
};
export const authController = {
  register,
  verify,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
};
