import { Router } from "express";

import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
} from "./product.controller.js";

import {
  requireAuth,
  requireAdmin,
} from "../../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllProductsController);

router.get("/:id", getProductByIdController);

// Admin only route
router.post(
  "/",
  requireAuth,
  requireAdmin,
  createProductController
);

export default router;