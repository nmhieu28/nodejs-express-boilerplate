import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { appSettings } from "../../configs/config";
import { autheRedisClient } from "../redis";
import logger from "../logger";
const refreshTokenKey = (userId: string) => `user_token:${userId}:refreshToken`;
export interface TokenResult {
  valid: boolean;
  payload: any;
}
export class JwtTokenHandler {
  generateToken = (user: any): string => {
    var token = jwt.sign(
      { userId: user.id, email: user.email },
      appSettings.jwt.secretKey,
      {
        algorithm: "HS256",
        audience: appSettings.jwt.audience,
        issuer: appSettings.jwt.issuer,
        expiresIn: appSettings.jwt.tokenExpire,
      } as SignOptions
    );
    return token;
  };
  verifyToken = (token: string, secret: string): TokenResult => {
    try {
      const decoded = jwt.verify(token, secret) as JwtPayload & any;

      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        return { valid: false, payload: {} };
      }

      if (
        decoded.aud !== appSettings.jwt.audience ||
        decoded.iss !== appSettings.jwt.issuer
      ) {
        return { valid: false, payload: {} };
      }

      return {
        valid: true,
        payload: { userId: decoded.userId, email: decoded.email },
      };
    } catch (err) {
      logger.error("Verify token has error: " + err.message);
      return { valid: false, payload: {} };
    }
  };
  generateRefreshToken = async (user: any) => {
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      appSettings.jwt.refreshSecretKey,
      {
        algorithm: "HS256",
        audience: appSettings.jwt.audience,
        issuer: appSettings.jwt.issuer,
        expiresIn: appSettings.jwt.refreshTokenExpire,
      } as SignOptions
    );
    await autheRedisClient.set(
      refreshTokenKey(user.id),
      refreshToken,
      appSettings.jwt.refreshTokenExpire
    );
    return refreshToken;
  };
}
