import accountApi from "./identity/route";

export const appRoutes: Record<string, any> = {
  [accountApi.prefix]: accountApi.router,
};
