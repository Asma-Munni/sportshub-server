import { Router } from "express";

import {
  createReviewController,
  deleteReviewController,
  getAllReviewsController,
  getReviewByIdController,
  updateReviewController,
} from "./review.controller.js";

import {
  requireAuth,
} from "../../middlewares/auth.middleware.js";

const router = Router();

// Public
router.get("/", getAllReviewsController);

router.get("/:id", getReviewByIdController);

// Logged-in user
router.post(
  "/",
  requireAuth,
  createReviewController
);

router.patch(
  "/:id",
  requireAuth,
  updateReviewController
);

router.delete(
  "/:id",
  requireAuth,
  deleteReviewController
);

export default router;