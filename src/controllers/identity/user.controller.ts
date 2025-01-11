import { Request, Response } from "express";
import { isSuccess } from "../../pkgs/response";
import { HttpContext } from "../../pkgs/http-context";
import { HTTP_CONTEXT } from "../../pkgs/constants";
import { UserService } from "../../features/identity/service/user.service";
const me = async (req: Request, res: Response): Promise<any> => {
  const user = HttpContext.get(HTTP_CONTEXT.USER);
  const result = await UserService.getUserInfo(user.id);
  if (isSuccess(result)) return res.json(result);
  else return res.status(400).json(result);
};
export const userController = {
  me,
};
