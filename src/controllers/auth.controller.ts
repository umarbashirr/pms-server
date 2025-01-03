import { Request, Response } from "express";
import { GlobalRoleEnum } from "../enums/global-role.enum";
import { ApiResponse } from "../helpers/api-response";
import { RegisterSchema } from "../schemas/auth.schema";
import { createNewUser, findUserByEmail } from "../services/user.service";

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

    // TODO: Send a verification email to the user

    res.status(200).json(ApiResponse("user created successfully!", true, user));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

const USER_LOGIN = async (req: Request, res: Response) => {};

export { USER_LOGIN, USER_REGISTRATION };
