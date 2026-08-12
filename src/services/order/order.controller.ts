// src/services/order/order.controller.ts
import { Request, Response } from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "./order.service.js";

/** Create a new order */
export const createOrderController = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const { shippingAddress, items } = req.body;
    const order = await createOrder(user.id, shippingAddress, items);
    res.status(201).json({ success: true, data: order, message: "Order placed successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

/** Get orders for the authenticated user */
export const getMyOrdersController = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const orders = await getUserOrders(user.id);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

/** Get a single order – owner or admin */
export const getOrderByIdController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const orderId = req.params.id;
    const order = await getOrderById(orderId);
    if (!order || order.isDeleted) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    const user = res.locals.user;
    // Owner or admin can view
    if (order.userId !== user.id && user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
};

/** Admin: fetch all orders */
export const getAllOrdersController = async (_req: Request, res: Response) => {
  try {
    const orders = await getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

/** Admin: update order status (and optionally payment status) */
export const updateOrderStatusController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const orderId = req.params.id;
    const { status, paymentStatus } = req.body;
    const updated = await updateOrderStatus(orderId, status, paymentStatus);
    res.status(200).json({ success: true, data: updated, message: "Order status updated" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

/** Admin: soft delete order */
export const deleteOrderController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const orderId = req.params.id;
    await deleteOrder(orderId);
    res.status(200).json({ success: true, message: "Order deleted" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};
