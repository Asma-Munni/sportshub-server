import { Router } from "express";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from "./category.controller.js";
import {
  requireAdmin,
  requireAuth,
} from "../../middlewares/auth.middleware.js";

const router = Router();

// Public route
router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);

router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  updateCategoryController
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  deleteCategoryController
);

// Admin only route
router.post(
  "/",
  requireAuth,
  requireAdmin,
  createCategoryController
);

export default router;