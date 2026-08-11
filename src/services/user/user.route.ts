import { Router } from "express";
import {
  getCurrentUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from "./user.controller.js";
import {
  requireAuth,
  requireAdmin,
} from "../../middlewares/auth.middleware.js";

const router = Router();

// Current user profile route
router.get("/me", requireAuth, getCurrentUserController);

// Admin-only user management routes
router.get("/", requireAuth, requireAdmin, getAllUsersController);
router.get("/:id", requireAuth, requireAdmin, getUserByIdController);
router.patch("/:id", requireAuth, requireAdmin, updateUserController);
router.delete("/:id", requireAuth, requireAdmin, deleteUserController);

export default router;
