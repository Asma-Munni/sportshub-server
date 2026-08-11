// src/services/wishlist/wishlist.route.ts
import { Router } from "express";
import {
  addToWishlistController,
  getWishlistController,
  removeFromWishlistController,
} from "./wishlist.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

// Add to wishlist
router.post("/", requireAuth, addToWishlistController);

// Get user's wishlist
router.get("/", requireAuth, getWishlistController);

// Remove from wishlist (soft delete)
router.delete("/:id", requireAuth, removeFromWishlistController);

export default router;
