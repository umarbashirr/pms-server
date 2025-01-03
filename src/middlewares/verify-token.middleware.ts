import { AccessCookieEnum } from "./../enums/cookie.enum";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../helpers/api-response";
import { CustomRequest } from "../interfaces/custom-request.interface";

const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies[AccessCookieEnum.NAME] ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(400).json(ApiResponse("Un-authorized request!", false));
      return;
    }

    const decodedToken: any = await jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!
    );

    if (!decodedToken) {
      res.status(400).json(ApiResponse("Un-authorized request!", false));
      return;
    }

    (req as CustomRequest).userId = decodedToken._id;

    next();
  } catch (error: any) {
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export default verifyAccessToken;
