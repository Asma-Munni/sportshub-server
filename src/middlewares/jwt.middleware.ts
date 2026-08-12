import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  createRemoteJWKSet,
  jwtVerify,
} from "jose";

const backendUrl = (
  process.env.BETTER_AUTH_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

const JWKS = createRemoteJWKSet(
  new URL(
    `${backendUrl}/api/auth/jwks`
  )
);

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith(
        "Bearer "
      )
    ) {
      res.status(401).json({
        success: false,
        message:
          "JWT token is required",
      });

      return;
    }

    const token =
      authorization.split(" ")[1];

    const { payload } =
      await jwtVerify(token, JWKS, {
        issuer: backendUrl,
        audience: backendUrl,
      });

    res.locals.jwtUser =
      payload;

    next();
  } catch {
    res.status(401).json({
      success: false,
      message:
        "Invalid or expired JWT token",
    });
  }
};