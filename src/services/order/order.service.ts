// src/services/order/order.service.ts
import { prisma } from "../../lib/prisma.js";
import { Prisma } from "@prisma/client";

export type OrderItemInput = {
  productId: string;
  quantity: number;
};

/**
 * Create a new order for the authenticated user.
 * Performs validation, calculates total amount, creates order items,
 * updates product stock and status within a transaction.
 */
export const createOrder = async (
  userId: string,
  shippingAddress: string,
  items: OrderItemInput[]
) => {
  if (!items || items.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  // Validate each product and compute line totals
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isDeleted: false },
    include: { category: true },
  });

  if (products.length !== productIds.length) {
    throw new Error("One or more products not found");
  }

  // Map for quick lookup
  const productMap = new Map<string, any>();
  for (const p of products) {
    if (p.status !== "AVAILABLE") {
      throw new Error(`Product ${p.name} is not available for purchase`);
    }
    productMap.set(p.id, p);
  }

  // Verify stock availability and compute total
  let totalAmount = new Prisma.Decimal(0);
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (item.quantity <= 0) {
      throw new Error("Quantity must be positive");
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.name}`);
    }
    const lineTotal = new Prisma.Decimal(product.price).mul(item.quantity);
    totalAmount = totalAmount.add(lineTotal);
  }

  // Transaction to create order, order items and adjust stock
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        shippingAddress,
        totalAmount: totalAmount.toNumber(),
        status: "PENDING",
        paymentStatus: "UNPAID",
      },
    });

    const orderItemCreates = items.map((item) => {
      const product = productMap.get(item.productId);
      return tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          price: product.price, // snapshot price
        },
      });
    });
    await Promise.all(orderItemCreates);

    // Decrease stock and possibly mark product OUT_OF_STOCK
    for (const item of items) {
      const product = productMap.get(item.productId);
      const newStock = product.stock - item.quantity;
      await tx.product.update({
        where: { id: product.id },
        data: {
          stock: newStock,
          status: newStock === 0 ? "OUT_OF_STOCK" : product.status,
        },
      });
    }

    return order;
  });
};

/** Get orders for a specific user (owner) */
export const getUserOrders = async (userId: string) => {
  return await prisma.order.findMany({
    where: { userId, isDeleted: false },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
};

/** Get a single order – owner or admin can view */
export const getOrderById = async (orderId: string) => {
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } }, user: true },
  });
};

/** Admin: get all orders */
export const getAllOrders = async () => {
  return await prisma.order.findMany({
    where: { isDeleted: false },
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: "desc" },
  });
};

/** Admin: update order status */
export const updateOrderStatus = async (
  orderId: string,
  status: string,
  paymentStatus?: string
) => {
  const data: any = { status };
  if (paymentStatus) data.paymentStatus = paymentStatus;
  return await prisma.order.update({
    where: { id: orderId },
    data,
  });
};

/** Soft delete an order (admin only) */
export const deleteOrder = async (orderId: string) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: { isDeleted: true },
  });
};
