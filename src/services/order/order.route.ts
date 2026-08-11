// src/services/order/order.route.ts
import { Router } from "express";
import {
  createOrderController,
  getMyOrdersController,
  getOrderByIdController,
  getAllOrdersController,
  updateOrderStatusController,
  deleteOrderController,
} from "./order.controller.js";
import { requireAuth, requireAdmin } from "../../middlewares/auth.middleware.js";

const router = Router();

// User creates an order
router.post("/", requireAuth, createOrderController);

// User fetches their own orders
router.get("/my-orders", requireAuth, getMyOrdersController);

// Get a single order (owner or admin handled in controller)
router.get("/:id", requireAuth, getOrderByIdController);

// Admin: list all orders
router.get("/", requireAuth, requireAdmin, getAllOrdersController);

// Admin: update order status (and optionally payment status)
router.patch("/:id", requireAuth, requireAdmin, updateOrderStatusController);

// Admin: soft delete order
router.delete("/:id", requireAuth, requireAdmin, deleteOrderController);

export default router;
