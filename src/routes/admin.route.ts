import { Router } from "express";
import {
  requireAdmin,
  requireAuth,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/test",
  requireAuth,
  requireAdmin,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin! You can access this route.",
      data: {
        user: res.locals.user,
      },
    });
  }
);

export default router;