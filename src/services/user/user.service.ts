import { prisma } from "../../lib/prisma.js";

export type UpdateUserPayload = {
  name?: string;
  image?: string;
  role?: "USER" | "ADMIN";
  status?: "ACTIVE" | "BLOCKED";
};

export const getCurrentUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user || user.isDeleted) {
    throw new Error("User not found or deleted");
  }

  return user;
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user || user.isDeleted) {
    throw new Error("User not found");
  }

  return user;
};

export const updateUser = async (id: string, payload: UpdateUserPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!existingUser || existingUser.isDeleted) {
    throw new Error("User not found");
  }

  return prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });
};

export const deleteUser = async (id: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!existingUser || existingUser.isDeleted) {
    throw new Error("User not found");
  }

  return prisma.user.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
};
