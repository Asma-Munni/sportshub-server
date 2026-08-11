import { prisma } from "../../lib/prisma.js";

type CreateProductPayload = {
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  categoryId: string;
};

export const createProduct = async (
  payload: CreateProductPayload
) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      slug: payload.slug,
    },
  });

  if (existingProduct) {
    throw new Error("Product slug already exists");
  }

  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category || category.isDeleted) {
    throw new Error("Category not found");
  }

  if (category.status !== "ACTIVE") {
    throw new Error("Category is inactive");
  }

  const product = await prisma.product.create({
    data: {
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      price: payload.price,
      stock: payload.stock,
      image: payload.image,
      categoryId: payload.categoryId,
      status:
        payload.stock > 0
          ? "AVAILABLE"
          : "OUT_OF_STOCK",
    },
    include: {
      category: true,
    },
  });

  return product;
};

export const getAllProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      isDeleted: false,
    },

    include: {
      category: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return products;
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },

    include: {
      category: true,
    },
  });

  if (!product || product.isDeleted) {
    throw new Error("Product not found");
  }

  return product;
};

type UpdateProductPayload = {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  stock?: number;
  image?: string;
  categoryId?: string;
  status?: "AVAILABLE" | "OUT_OF_STOCK" | "INACTIVE";
};

export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload
) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!existingProduct || existingProduct.isDeleted) {
    throw new Error("Product not found");
  }

  if (payload.slug) {
    const duplicateProduct = await prisma.product.findFirst({
      where: {
        slug: payload.slug,
        id: {
          not: id,
        },
      },
    });

    if (duplicateProduct) {
      throw new Error("Product slug already exists");
    }
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

    if (!category || category.isDeleted) {
      throw new Error("Category not found");
    }

    if (category.status !== "ACTIVE") {
      throw new Error("Category is inactive");
    }
  }

  if (payload.price !== undefined && payload.price < 0) {
    throw new Error("Price cannot be negative");
  }

  if (payload.stock !== undefined && payload.stock < 0) {
    throw new Error("Stock cannot be negative");
  }

  const data = {
    ...payload,

    ...(payload.stock !== undefined &&
      payload.status === undefined && {
        status:
          payload.stock > 0
            ? ("AVAILABLE" as const)
            : ("OUT_OF_STOCK" as const),
      }),
  };

  const product = await prisma.product.update({
    where: {
      id,
    },

    data,

    include: {
      category: true,
    },
  });

  return product;
};
 
type UpdateProductPayload = {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  stock?: number;
  image?: string;
  categoryId?: string;
  status?: "AVAILABLE" | "OUT_OF_STOCK" | "INACTIVE";
};

export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload
) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!existingProduct || existingProduct.isDeleted) {
    throw new Error("Product not found");
  }

  if (payload.slug) {
    const duplicateProduct = await prisma.product.findFirst({
      where: {
        slug: payload.slug,
        id: {
          not: id,
        },
      },
    });

    if (duplicateProduct) {
      throw new Error("Product slug already exists");
    }
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

    if (!category || category.isDeleted) {
      throw new Error("Category not found");
    }

    if (category.status !== "ACTIVE") {
      throw new Error("Category is inactive");
    }
  }

  if (payload.price !== undefined && payload.price < 0) {
    throw new Error("Price cannot be negative");
  }

  if (payload.stock !== undefined && payload.stock < 0) {
    throw new Error("Stock cannot be negative");
  }

  const data = {
    ...payload,

    ...(payload.stock !== undefined &&
      payload.status === undefined && {
        status:
          payload.stock > 0
            ? ("AVAILABLE" as const)
            : ("OUT_OF_STOCK" as const),
      }),
  };

  const product = await prisma.product.update({
    where: {
      id,
    },

    data,

    include: {
      category: true,
    },
  });

  return product;
};