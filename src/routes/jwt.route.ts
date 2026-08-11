import { Router } from "express";
import { verifyJWT } from "../middlewares/jwt.middleware.js";

const router = Router();

router.get("/protected", verifyJWT, (req, res) => {
  res.status(200).json({
    success: true,
    message: "JWT verified successfully",
    data: {
      user: res.locals.jwtUser,
    },
  });
});

export default router;