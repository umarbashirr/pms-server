import { Request, Response } from "express";
import { GlobalRoleEnum } from "../enums/global-role.enum";
import { ApiResponse } from "../helpers/api-response";
import { LoginSchema, RegisterSchema } from "../schemas/auth.schema";
import {
  createNewUser,
  findUserByEmail,
  findUserByEmailWithPassword,
} from "../services/user.service";
import { AccessCookieEnum } from "../enums/cookie.enum";

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
    const existingUser = await findUserByEmailWithPassword(email);

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

    res.status(200).json(ApiResponse("Logged In Successfully!", true, token));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export { USER_LOGIN, USER_REGISTRATION };
