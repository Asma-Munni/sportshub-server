import { prisma } from "../../lib/prisma.js";

type CreateReviewPayload = {
  rating: number;
  comment?: string;
  userId: string;
  productId: string;
};

type UpdateReviewPayload = {
  rating?: number;
  comment?: string;
  status?: "ACTIVE" | "INACTIVE";
};

// Create Review
export const createReview = async (
  payload: CreateReviewPayload
) => {
  if (payload.rating < 1 || payload.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const product = await prisma.product.findUnique({
    where: {
      id: payload.productId,
    },
  });

  if (!product || product.isDeleted) {
    throw new Error("Product not found");
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      userId: payload.userId,
      productId: payload.productId,
      isDeleted: false,
    },
  });

  if (existingReview) {
    throw new Error(
      "You have already reviewed this product"
    );
  }

  const review = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      userId: payload.userId,
      productId: payload.productId,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },

      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return review;
};

// Get All Reviews
export const getAllReviews = async (
  productId?: string
) => {
  const reviews = await prisma.review.findMany({
    where: {
      isDeleted: false,
      status: "ACTIVE",

      ...(productId && {
        productId,
      }),
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },

      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

// Get Review By ID
export const getReviewById = async (
  id: string
) => {
  const review = await prisma.review.findUnique({
    where: {
      id,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },

      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!review || review.isDeleted) {
    throw new Error("Review not found");
  }

  return review;
};

// Update Review
export const updateReview = async (
  id: string,
  userId: string,
  payload: UpdateReviewPayload,
  isAdmin = false
) => {
  const review = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!review || review.isDeleted) {
    throw new Error("Review not found");
  }

  if (!isAdmin && review.userId !== userId) {
    throw new Error(
      "You can only update your own review"
    );
  }

  if (
    payload.rating !== undefined &&
    (payload.rating < 1 || payload.rating > 5)
  ) {
    throw new Error("Rating must be between 1 and 5");
  }

  return prisma.review.update({
    where: {
      id,
    },

    data: {
      rating: payload.rating,
      comment: payload.comment,
      ...(isAdmin &&
        payload.status && {
          status: payload.status,
        }),
    },
  });
};

// Soft Delete Review
export const deleteReview = async (
  id: string,
  userId: string,
  isAdmin = false
) => {
  const review = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!review || review.isDeleted) {
    throw new Error("Review not found");
  }

  if (!isAdmin && review.userId !== userId) {
    throw new Error(
      "You can only delete your own review"
    );
  }

  return prisma.review.update({
    where: {
      id,
    },

    data: {
      isDeleted: true,
      status: "INACTIVE",
    },
  });
};