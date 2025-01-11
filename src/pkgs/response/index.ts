import { GenericErrorCode } from "../../errors/generic.error";
import { StringExtension } from "../extensions/string";
interface MetaData {
  code: string;
  message: string | null;
}
export interface IResult {}
export interface Result<TData> extends IResult {
  metadata: MetaData;
  data: TData | null;
}

export function successResult<T>(
  data: T,
  message: string | null = null
): Result<T> {
  return {
    metadata: {
      code: StringExtension.formatErrorCode(
        "GenericErrorCode",
        GenericErrorCode.SUCCESS
      ),
      message,
    },
    data,
  };
}

export function failureResult<T>(
  errorCode: string,
  message: string | null = null
): Result<T> {
  return {
    metadata: {
      code: errorCode,
      message: message,
    },
    data: null,
  };
}

export const isSuccess = (result: any) => result.metadata.code == "GEC-0";
