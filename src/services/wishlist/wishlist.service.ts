// src/services/wishlist/wishlist.service.ts
import { prisma } from "../../lib/prisma.js";

export const addToWishlist = async (userId: string, productId: string) => {
  // Ensure product exists and not deleted
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { isDeleted: true },
  });
  if (!product || product.isDeleted) {
    throw new Error("Product not found");
  }

  // Create or return existing
  const existing = await prisma.wishlist.findFirst({
    where: { userId, productId, isDeleted: false },
  });
  if (existing) {
    return existing; // already in wishlist
  }

  return await prisma.wishlist.create({
    data: { userId, productId },
    include: { product: true },
  });
};

export const getUserWishlist = async (userId: string) => {
  return await prisma.wishlist.findMany({
    where: { userId, isDeleted: false },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
};

export const removeFromWishlist = async (id: string, userId: string) => {
  const wish = await prisma.wishlist.findUnique({
    where: { id },
  });
  if (!wish || wish.isDeleted) {
    throw new Error("Wishlist entry not found");
  }
  if (wish.userId !== userId) {
    throw new Error("Forbidden");
  }
  return await prisma.wishlist.update({
    where: { id },
    data: { isDeleted: true },
  });
};
