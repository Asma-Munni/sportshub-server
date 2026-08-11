import { prisma } from "../../lib/prisma.js";

type CreateCategoryPayload = {
  name: string;
  slug: string;
  description?: string;
  image?: string;
};

export const createCategory = async (
  payload: CreateCategoryPayload
) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [
        { name: payload.name },
        { slug: payload.slug },
      ],
    },
  });

  if (existingCategory) {
    throw new Error("Category name or slug already exists");
  }

  const category = await prisma.category.create({
    data: {
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      image: payload.image,
    },
  });

  return category;
};

export const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category || category.isDeleted) {
    throw new Error("Category not found");
  }

  return category;
};

type UpdateCategoryPayload = {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE";
};

export const updateCategory = async (
  id: string,
  payload: UpdateCategoryPayload
) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!existingCategory || existingCategory.isDeleted) {
    throw new Error("Category not found");
  }

  if (payload.name || payload.slug) {
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        id: {
          not: id,
        },
        OR: [
          payload.name ? { name: payload.name } : undefined,
          payload.slug ? { slug: payload.slug } : undefined,
        ].filter(Boolean) as { name?: string; slug?: string }[],
      },
    });

    if (duplicateCategory) {
      throw new Error("Category name or slug already exists");
    }
  }

  return prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });
};

export const deleteCategory = async (id: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!existingCategory || existingCategory.isDeleted) {
    throw new Error("Category not found");
  }

  const category = await prisma.category.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      status: "INACTIVE",
    },
  });

  return category;
};