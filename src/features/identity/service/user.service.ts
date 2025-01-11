import appDataSource from "../../../database/app.datasource";
import { User } from "../../../entities/identity/user.entity";
import { IdentityErrorCode } from "../../../errors/identity.error";
import { UserInfo } from "../../../models/identity/user-info.response";
import { StringExtension } from "../../../pkgs/extensions/string";
import { failureResult, Result, successResult } from "../../../pkgs/response";

const _userRepository = appDataSource.getRepository(User);
async function getUserInfo(id: string): Promise<Result<UserInfo>> {
  const user = await _userRepository.findOneBy({ id: id });

  if (!user) {
    return failureResult(
      StringExtension.formatErrorCode(
        "IdentityErrorCode",
        IdentityErrorCode.EmailIsNotExists
      ),
      IdentityErrorCode[IdentityErrorCode.EmailIsNotExists]
    );
  }

  const response = {
    id: user.id,
    email: user.email,
    avatar: user.avatar,
    fullName: user.fullname(),
  } as UserInfo;

  return successResult(response);
}
export const UserService = { getUserInfo };
