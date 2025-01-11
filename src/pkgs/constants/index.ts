export const CORRELATION_ID = "correlationId";
export const HEADER_CORRELATION_ID = "x-correlation-id";

export const REDIS_DATABASE_NUMBER = {
  IDENTITY: 1,
};

// identity
export const MAX_TTL_OTP = 60 * 60;

export const EMAIL_TEMPLATE_VARIABLE = {
  TEMPLATE: "src/email-templates",
  REGISTER: {
    SUBJECT: "Welcome to AppName - Verify Your Account",
    NAME: "register",
    CONFIRM_URL: "{{.ConfirmationURL}}",
    TOKEN: "{{.Token}}",
  },
  FORGOT_PASSWORD: {
    SUBJECT: "AppName password change request",
    NAME: "forgot_password",
    ForgotURL: "{{.ForgotURL}}",
    TOKEN: "{{.Token}}",
  },
};
export const INTERNAL_URL = {
  VERIFY_CODE: "/account/verify-account?code=",
  FORGOT_PASSWORD: "/account/reset-password?token=",
};
// HTTP Context
export const HTTP_CONTEXT = {
  USER: "user",
};
