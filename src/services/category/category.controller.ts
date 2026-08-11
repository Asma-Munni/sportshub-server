import { Request, Response } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./category.service.js";

export const createCategoryController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      slug,
      description,
      image,
    } = req.body;

    if (!name || !slug) {
      res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
      return;
    }

    const category = await createCategory({
      name,
      slug,
      description,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create category",
    });
  }
};

export const getAllCategoriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const categories = await getAllCategories();

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve categories",
    });
  }
};

export const getCategoryByIdController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const category = await getCategoryById(id);

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Category not found",
    });
  }
};

export const updateCategoryController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const category = await updateCategory(id, req.body);

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update category",
    });
  }
};

export const deleteCategoryController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const category = await deleteCategory(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete category",
    });
  }
};