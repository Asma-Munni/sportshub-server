// src/services/wishlist/wishlist.controller.ts
import { Request, Response } from "express";
import { addToWishlist, getUserWishlist, removeFromWishlist } from "./wishlist.service.js";

export const addToWishlistController = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const { productId } = req.body;
    const entry = await addToWishlist(user.id, productId);
    res.status(201).json({ success: true, data: entry, message: "Added to wishlist" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const getWishlistController = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const list = await getUserWishlist(user.id);
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const removeFromWishlistController = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const id = req.params.id;
    await removeFromWishlist(id, user.id);
    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};
