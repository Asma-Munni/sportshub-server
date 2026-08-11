import { Router } from "express";

import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "./product.controller.js";

import {
  requireAuth,
  requireAdmin,
} from "../../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllProductsController);
router.get("/:id", getProductByIdController);

// Admin only routes
router.post(
  "/",
  requireAuth,
  requireAdmin,
  createProductController
);

router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  updateProductController
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  deleteProductController
);

export default router;