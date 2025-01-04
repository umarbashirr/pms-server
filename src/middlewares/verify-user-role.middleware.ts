import { NextFunction, Response } from "express";
import { CustomRequest } from "../interfaces/custom-request.interface";
import { ApiResponse } from "../helpers/api-response";
import User from "../models/user.model";

export const VerifyUserRole = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      res.status(401).json(ApiResponse("Un-authorized", false));
      return;
    }

    (req as CustomRequest).role = user.role;

    next();
  } catch (error) {
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};
