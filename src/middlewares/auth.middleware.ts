import { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
      return;
    }

    if (session.user.isDeleted) {
      res.status(403).json({
        success: false,
        message: "This account has been deleted.",
      });
      return;
    }

    if (session.user.status === "BLOCKED") {
      res.status(403).json({
        success: false,
        message: "This account has been blocked.",
      });
      return;
    }

    res.locals.user = session.user;
    res.locals.session = session.session;

    next();
  } catch (error) {
    console.error(error);

    res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  if (!user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
    return;
  }

  if (user.role !== "ADMIN") {
    res.status(403).json({
      success: false,
      message: "Forbidden. Admin access required.",
    });
    return;
  }

  next();
};