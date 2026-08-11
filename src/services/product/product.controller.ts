import { Request, Response } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./product.service.js";

export const createProductController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      stock,
      image,
      categoryId,
    } = req.body;

    if (
      !name ||
      !slug ||
      price === undefined ||
      stock === undefined ||
      !categoryId
    ) {
      res.status(400).json({
        success: false,
        message:
          "Name, slug, price, stock and categoryId are required",
      });
      return;
    }

    if (Number(price) < 0) {
      res.status(400).json({
        success: false,
        message: "Price cannot be negative",
      });
      return;
    }

    if (Number(stock) < 0) {
      res.status(400).json({
        success: false,
        message: "Stock cannot be negative",
      });
      return;
    }

    const product = await createProduct({
      name,
      slug,
      description,
      price: Number(price),
      stock: Number(stock),
      image,
      categoryId,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create product",
    });
  }
};

export const getAllProductsController = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await getAllProducts();

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
    });
  }
};

export const getProductByIdController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const product = await getProductById(id);

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Product not found",
    });
  }
};

export const updateProductController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      price,
      stock,
      image,
      categoryId,
      status,
    } = req.body;

    const payload: any = {};
    if (name !== undefined) payload.name = name;
    if (slug !== undefined) payload.slug = slug;
    if (description !== undefined) payload.description = description;
    if (price !== undefined) payload.price = Number(price);
    if (stock !== undefined) payload.stock = Number(stock);
    if (image !== undefined) payload.image = image;
    if (categoryId !== undefined) payload.categoryId = categoryId;
    if (status !== undefined) payload.status = status;

    const product = await updateProduct(id, payload);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update product",
    });
  }
};

export const deleteProductController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const product = await deleteProduct(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Product not found",
    });
  }
};