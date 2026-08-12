import { Request, Response } from "express";

import {
  createReview,
  deleteReview,
  getAllReviews,
  getReviewById,
  updateReview,
} from "./review.service.js";

// Create Review
export const createReviewController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = res.locals.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
      return;
    }

    const {
      rating,
      comment,
      productId,
    } = req.body;

    if (
      rating === undefined ||
      !productId
    ) {
      res.status(400).json({
        success: false,
        message: "Rating and productId are required",
      });
      return;
    }

    const numericRating = Number(rating);

    if (
      Number.isNaN(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
      return;
    }

    const review = await createReview({
      rating: numericRating,
      comment,
      productId,
      userId: user.id,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create review",
    });
  }
};


// Get All Reviews
export const getAllReviewsController = async (
  req: Request,
  res: Response
) => {
  try {
    const productId =
      typeof req.query.productId === "string"
        ? req.query.productId
        : undefined;

    const reviews = await getAllReviews(
      productId
    );

    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve reviews",
    });
  }
};


// Get Review By ID
export const getReviewByIdController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const review = await getReviewById(id);

    res.status(200).json({
      success: true,
      message: "Review retrieved successfully",
      data: review,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Review not found",
    });
  }
};


// Update Review
export const updateReviewController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const user = res.locals.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
      return;
    }

    const { id } = req.params;

    const {
      rating,
      comment,
      status,
    } = req.body;

    const numericRating =
      rating !== undefined
        ? Number(rating)
        : undefined;

    if (
      numericRating !== undefined &&
      (
        Number.isNaN(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
      )
    ) {
      res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
      return;
    }

    const isAdmin =
      user.role === "ADMIN";

    const review = await updateReview(
      id,
      user.id,
      {
        rating: numericRating,
        comment,
        status,
      },
      isAdmin
    );

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update review",
    });
  }
};


// Soft Delete Review
export const deleteReviewController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const user = res.locals.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
      return;
    }

    const { id } = req.params;

    const isAdmin =
      user.role === "ADMIN";

    const review = await deleteReview(
      id,
      user.id,
      isAdmin
    );

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete review",
    });
  }
};