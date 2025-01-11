import { Router } from "express";
import { authController } from "./auth.controller";
import { validateCreateUser } from "../../models/identity/create-user.request";
import { validateLoginRequest } from "../../models/identity/login.request";
import { AuthenticateJWTMiddleware } from "../../middlewares/authenticate/jwt.middleware";
import { userController } from "./user.controller";
import { group } from "../../pkgs/routes";

const accountApi = group("/accounts", [], (router: Router) => {
  router.post("/register", validateCreateUser, authController.register);
  router.post("/verify", authController.verify);
  router.post("/login", validateLoginRequest, authController.login);
  router.post("/refresh-token", authController.refreshToken);
  router.post("/forgot-password", authController.forgotPassword);
  router.get("/me", AuthenticateJWTMiddleware, userController.me);
});

export default accountApi;
