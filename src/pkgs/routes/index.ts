import { Router } from "express";
export const group = (
  prefix: string,
  middlewares: (string | RegExp)[],
  routeHandler: Function
) => {
  const router = Router();
  if (middlewares && middlewares.length) {
    router.use(middlewares);
  }
  routeHandler(router);
  return { prefix, router };
};
