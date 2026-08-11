import { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS = createRemoteJWKSet(
  new URL("http://localhost:5000/api/auth/jwks")
);

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "JWT token is required",
      });
      return;
    }

    const token = authorization.split(" ")[1];

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: "http://localhost:5000",
      audience: "http://localhost:5000",
    });

    res.locals.jwtUser = payload;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired JWT token",
    });
  }
};