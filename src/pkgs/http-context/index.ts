import { createNamespace } from "cls-hooked";
import { Request, Response, NextFunction } from "express";

const httpCtx = createNamespace("request-context");

function middleware(req: Request, res: Response, next: NextFunction) {
  httpCtx.run(() => next());
}

function get(key: string) {
  if (httpCtx && httpCtx.active) {
    return httpCtx.get(key);
  }
}
function set(key: string, value: any) {
  if (httpCtx && httpCtx.active) {
    return httpCtx.set(key, value);
  }
}

export const HttpContext = {
  middleware,
  get,
  set,
};
