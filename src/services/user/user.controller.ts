import { Request, Response } from "express";
import {
  getCurrentUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./user.service.js";

export const getCurrentUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const currentSessionUser = res.locals.user;
    if (!currentSessionUser) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const user = await getCurrentUser(currentSessionUser.id);

    res.status(200).json({
      success: true,
      message: "Current user profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve current user profile",
    });
  }
};

export const getAllUsersController = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
    });
  }
};

export const getUserByIdController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "User not found",
    });
  }
};

export const updateUserController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name, image, role, status } = req.body;
    const currentUser = res.locals.user;

    // Self-modification safety guards
    if (currentUser && currentUser.id === id) {
      if (role && role !== "ADMIN") {
        res.status(400).json({
          success: false,
          message: "Admins cannot demote themselves. Self-demotion is restricted.",
        });
        return;
      }
      if (status && status === "BLOCKED") {
        res.status(400).json({
          success: false,
          message: "Admins cannot block themselves. Self-blocking is restricted.",
        });
        return;
      }
    }

    const payload: any = {};
    if (name !== undefined) payload.name = name;
    if (image !== undefined) payload.image = image;
    if (role !== undefined) payload.role = role;
    if (status !== undefined) payload.status = status;

    const updated = await updateUser(id, payload);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update user",
    });
  }
};

export const deleteUserController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const currentUser = res.locals.user;

    // Self-deletion safety guard
    if (currentUser && currentUser.id === id) {
      res.status(400).json({
        success: false,
        message: "Admins cannot delete themselves. Self-deletion is restricted.",
      });
      return;
    }

    const deleted = await deleteUser(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "User not found",
    });
  }
};
