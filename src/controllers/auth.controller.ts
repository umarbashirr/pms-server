import { Request, Response } from "express";
import { GlobalRoleEnum } from "../enums/global-role.enum";
import { ApiResponse } from "../helpers/api-response";
import {
  LoginSchema,
  RegisterSchema,
  TeamRegisterSchema,
} from "../schemas/auth.schema";
import {
  createNewUser,
  findUserByEmail,
  findUserByEmailWithPassword,
} from "../services/user.service";
import { AccessCookieEnum } from "../enums/cookie.enum";
import { CustomRequest } from "../interfaces/custom-request.interface";
import User from "../models/user.model";

const USER_REGISTRATION = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // validate the requested body object through zod validation
    const fields = RegisterSchema.safeParse(req.body);

    if (!fields.success) {
      res
        .status(400)
        .json(ApiResponse("Invalid provided details", false, null));
      return;
    }

    const { name, email, phoneNumber, password } = fields.data;

    // Check if user already exists if any throw error response
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      res.status(409).json(ApiResponse("Email already in use!", false));
      return;
    }

    // Create new user as REGULAR_USER global role
    const user = await createNewUser({
      name,
      email,
      phoneNumber,
      password,
      role: GlobalRoleEnum.REGULAR_USER,
    });

    res.status(200).json(ApiResponse("user created successfully!", true, user));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

const USER_LOGIN = async (req: Request, res: Response) => {
  try {
    // validate the requested body object through zod validation
    const fields = LoginSchema.safeParse(req.body);

    if (!fields.success) {
      res
        .status(400)
        .json(ApiResponse("Invalid provided details", false, null));
      return;
    }

    const { email, password } = fields.data;

    // Check if user already exists if not exists throw error response
    const existingUser = await User.findOne({
      email,
    }).select("+password");

    if (!existingUser) {
      res.status(404).json(ApiResponse("No user found!", false));
      return;
    }

    const isPasswordMatched = await existingUser.comparePassword(password);

    if (!isPasswordMatched) {
      res.status(400).json(ApiResponse("Invalid credentials!", false));
      return;
    }

    const token = await existingUser.getAccessToken();

    res.cookie(AccessCookieEnum.NAME, token, {
      secure: true,
      httpOnly: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(
      ApiResponse("Logged In Successfully!", true, {
        token,
        user: {
          _id: existingUser?._id,
          name: existingUser?.name,
          email: existingUser?.email,
          role: existingUser?.role,
        },
      })
    );
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const USER_REGISTRATION_INTERNAL = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // validate the requested body object through zod validation
    const fields = TeamRegisterSchema.safeParse(req.body);

    if (!fields.success) {
      res
        .status(400)
        .json(ApiResponse("Invalid provided details", false, null));
      return;
    }

    const { name, email, phoneNumber, role, password } = fields.data;

    // Check if user already exists if any throw error response
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      res.status(409).json(ApiResponse("Email already in use!", false));
      return;
    }

    // Create new user as REGULAR_USER global role
    const user = await createNewUser({
      name,
      email,
      phoneNumber,
      password,
      role,
    });

    res.status(200).json(ApiResponse("user created successfully!", true, user));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const VALIDATE_USER = async (req: CustomRequest, res: Response) => {
  try {
    const { userId, role } = req;

    res.status(200).json(
      ApiResponse("validated", true, {
        _id: userId,
        role: role,
      })
    );
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
    return;
  }
};

export const HasAdminRights = async (req: CustomRequest, res: Response) => {
  try {
    const { userId, role } = req;

    res.status(200).json(
      ApiResponse("validated", true, {
        _id: userId,
        role: role,
      })
    );
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const USER_LOGOUT = async (req: Request, res: Response) => {
  try {
    // Clear the authentication cookie
    res.clearCookie(AccessCookieEnum.NAME, {
      secure: true,
      httpOnly: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production",
    });

    res.status(200).json(ApiResponse("Logged Out Successfully!", true));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export { USER_LOGIN, USER_REGISTRATION };
