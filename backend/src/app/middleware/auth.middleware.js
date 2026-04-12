import ApiError from "../../utils/api-error.js";
import BaseDto from "../../dto/base.dto.js";
import { verifyUserToken } from "../auth/utils/index.js";

export function authMiddleware() {
  return function (req, res, next) {
    const header = req.headers["authorization"];
    if (!header) return next();
    if (!header?.startsWith("Bearer")) {
      throw ApiError.unauthorized("Invalid token format");
    }
    const token = header.split(" ")[1];
    if (!token) {
      throw ApiError.unauthorized("Invalid token format");
    }
    const payload = verifyUserToken(token);
    req.user = payload;
    next();
  };
}

export function restrictToAuthenticatedUser() {
  return function (req, res, next) {
    if (!req.user) {
      throw ApiError.unauthorized(
        "You are not authorized to access this resource",
      );
    }
    return next();
  };
}


export function validate(DtoClass, target = "body") {
  return async function (req, res, next) {
    try {
      const data = req[target];
      req[target] = await DtoClass.validate(data);
      next();
    } catch (error) {
      next(error);
    }
  };
}
