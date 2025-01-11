import { User } from "../../../entities/identity/user.entity";
import appDataSource from "../../../database/app.datasource";
import { CreateUserRequest } from "../../../models/identity/create-user.request";
import { HashPassWord } from "../../../pkgs/hash-password";
import logger from "../../../pkgs/logger";
import { failureResult, Result, successResult } from "../../../pkgs/response";
import { StringExtension } from "../../../pkgs/extensions/string";
import { IdentityErrorCode } from "../../../errors/identity.error";
import { generateOTP } from "../../../pkgs/untils";
import { autheRedisClient } from "../../../pkgs/redis";
import {
  EMAIL_TEMPLATE_VARIABLE,
  INTERNAL_URL,
  MAX_TTL_OTP,
  REDIS_DATABASE_NUMBER,
} from "../../../pkgs/constants";
import path from "path";
import fs from "fs";
import { appSettings } from "../../../configs/config";
import { mailer } from "../../../pkgs/mailer";
import { LoginRequest } from "../../../models/identity/login.request";
import { JwtTokenHandler } from "../../../pkgs/jwt";
import { AuhthenResponse } from "../../../models/identity/authen.response";
const _userRepository = appDataSource.getRepository(User);

const otpRegisterKey = (userId: string) => `user_otp:${userId}:register`;
const forgotPasswordKey = (userId: string) =>
  `user_password_otp:${userId}:forgot_password`;

async function checkEmailExists(email: string): Promise<User> {
  const user = await _userRepository.findOne({
    where: { email },
  });
  return user;
}

async function register(user: CreateUserRequest): Promise<Result<boolean>> {
  try {
    const isEmailExist = await checkEmailExists(user.email);
    if (isEmailExist) {
      return failureResult(
        StringExtension.formatErrorCode(
          "IdentityErrorCode",
          IdentityErrorCode.EmailIsExists
        ),
        IdentityErrorCode[IdentityErrorCode.EmailIsExists]
      );
    }

    const passwordHash = await HashPassWord.hash(user.password);
    const newUser = _userRepository.create({
      email: user.email,
      passwordHash: passwordHash,
      emailConfirm: false,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    await _userRepository.save(newUser);

    const OTP = generateOTP();

    await autheRedisClient.set(otpRegisterKey(newUser.id), OTP, MAX_TTL_OTP);

    const templatePath = path.resolve(
      EMAIL_TEMPLATE_VARIABLE.TEMPLATE,
      `${EMAIL_TEMPLATE_VARIABLE.REGISTER.NAME}.html`
    );

    let template = fs.readFileSync(templatePath, "utf-8");
    const confirmURL = `${appSettings.internalUrl.client}${INTERNAL_URL.VERIFY_CODE}${OTP}`;

    template = template.replaceAll(
      EMAIL_TEMPLATE_VARIABLE.REGISTER.CONFIRM_URL,
      confirmURL
    );

    template = template.replace(EMAIL_TEMPLATE_VARIABLE.REGISTER.TOKEN, OTP);

    await mailer.sendMail(
      user.email,
      EMAIL_TEMPLATE_VARIABLE.REGISTER.SUBJECT,
      "",
      template
    );

    return successResult(true);
  } catch (error: any) {
    logger.error("can't add user: ", error.message);
    throw error;
  }
}

async function verify(email: string, code: string) {
  const user = await checkEmailExists(email);
  if (!user) {
    return failureResult(
      StringExtension.formatErrorCode(
        "IdentityErrorCode",
        IdentityErrorCode.EmailIsNotExists
      ),
      IdentityErrorCode[IdentityErrorCode.EmailIsNotExists]
    );
  }
  const otpValue = await autheRedisClient.get(otpRegisterKey(user.id));

  if (!otpValue || otpValue !== code) {
    return failureResult(
      StringExtension.formatErrorCode(
        "IdentityErrorCode",
        IdentityErrorCode.OTPIsNotValid
      ),
      IdentityErrorCode[IdentityErrorCode.OTPIsNotValid]
    );
  }
  user.emailConfirm = true;
  user.updatedBy = user.id;
  user.updatedDateTimeUTC = new Date(new Date().toUTCString());
  await _userRepository.save(user);
  return successResult(true);
}

async function refreshToken(token: string): Promise<any> {
  const tokenHandler = new JwtTokenHandler();
  const verifyResult = tokenHandler.verifyToken(
    token,
    appSettings.jwt.refreshSecretKey
  );

  if (!verifyResult.valid) {
    return failureResult(
      StringExtension.formatErrorCode(
        "IdentityErrorCode",
        IdentityErrorCode.TokenInValid
      ),
      IdentityErrorCode[IdentityErrorCode.TokenInValid]
    );
  }

  const isEmailExist = await checkEmailExists(verifyResult.payload.email);
  if (!isEmailExist) {
    return failureResult(
      StringExtension.formatErrorCode(
        "IdentityErrorCode",
        IdentityErrorCode.TokenInValid
      ),
      IdentityErrorCode[IdentityErrorCode.TokenInValid]
    );
  }
  const accessToken = tokenHandler.generateToken(verifyResult.payload);
  const refreshToken = await tokenHandler.generateRefreshToken(
    verifyResult.payload
  );
  return successResult({ accessToken, refreshToken });
}
async function login(request: LoginRequest): Promise<Result<AuhthenResponse>> {
  const user = await checkEmailExists(request.email);
  if (!user) {
    return failureResult(
      StringExtension.formatErrorCode(
        "IdentityErrorCode",
        IdentityErrorCode.EmailIsNotExists
      ),
      IdentityErrorCode[IdentityErrorCode.EmailIsNotExists]
    );
  }

  const isMatch = await HashPassWord.verify(
    request.password,
    user.passwordHash
  );

  if (!isMatch) {
    return failureResult(
      StringExtension.formatErrorCode(
        "IdentityErrorCode",
        IdentityErrorCode.InvalidCredentials
      ),
      IdentityErrorCode[IdentityErrorCode.InvalidCredentials]
    );
  }

  if (!user.emailConfirm) {
    return failureResult(
      StringExtension.formatErrorCode(
        "IdentityErrorCode",
        IdentityErrorCode.EmailNotActivated
      ),
      IdentityErrorCode[IdentityErrorCode.EmailNotActivated]
    );
  }

  try {
    const tokenHandler = new JwtTokenHandler();
    const token = tokenHandler.generateToken({
      id: user.id,
      email: user.email,
    });
    const refreshToken = await tokenHandler.generateRefreshToken({
      id: user.id,
      email: user.email,
    });
    const result = {
      token,
      refreshToken,
      tokenExpire: appSettings.jwt.tokenExpire * 1000,
      refreshTokenExpire: appSettings.jwt.refreshTokenExpire * 1000,
    } as AuhthenResponse;
    return successResult(result);
  } catch (err) {
    throw err;
  }
}
async function forgotPassword(email: string): Promise<any> {
  const user = await checkEmailExists(email);
  if (!user) {
    return failureResult(
      StringExtension.formatErrorCode(
        "IdentityErrorCode",
        IdentityErrorCode.EmailIsNotExists
      ),
      IdentityErrorCode[IdentityErrorCode.EmailIsNotExists]
    );
  }

  const OTP = generateOTP();

  await autheRedisClient.set(forgotPasswordKey(user.id), OTP, 60 * 10);

  const templatePath = path.resolve(
    EMAIL_TEMPLATE_VARIABLE.TEMPLATE,
    `${EMAIL_TEMPLATE_VARIABLE.FORGOT_PASSWORD.NAME}.html`
  );

  let template = fs.readFileSync(templatePath, "utf-8");
  template = template.replace(
    EMAIL_TEMPLATE_VARIABLE.FORGOT_PASSWORD.TOKEN,
    OTP
  );

  await mailer.sendMail(
    user.email,
    EMAIL_TEMPLATE_VARIABLE.FORGOT_PASSWORD.SUBJECT,
    "",
    template
  );

  return successResult(true);
}
async function resetPassword(email: string, code: string, password: string) {
  try {
    const user = await checkEmailExists(email);
    if (!user) {
      return failureResult(
        StringExtension.formatErrorCode(
          "IdentityErrorCode",
          IdentityErrorCode.EmailIsNotExists
        ),
        IdentityErrorCode[IdentityErrorCode.EmailIsNotExists]
      );
    }

    const otpValue = await autheRedisClient.get(forgotPasswordKey(user.id));

    if (!otpValue || otpValue !== code) {
      return failureResult(
        StringExtension.formatErrorCode(
          "IdentityErrorCode",
          IdentityErrorCode.OTPIsNotValid
        ),
        IdentityErrorCode[IdentityErrorCode.OTPIsNotValid]
      );
    }
    const passwordHash = await HashPassWord.hash(password);
    user.passwordHash = passwordHash;
    await _userRepository.save(user);
    return successResult(true);
  } catch (error) {
    logger.error("Cann't reset password error: " + error.message);
    return failureResult(
      StringExtension.formatErrorCode(
        "IdentityErrorCode",
        IdentityErrorCode.Invalid
      ),
      IdentityErrorCode[IdentityErrorCode.Invalid]
    );
  }
}

export const IdentityService = {
  checkEmailExists,
  register,
  verify,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
};
