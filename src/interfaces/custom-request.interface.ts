import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { GlobalRoleEnum } from "../enums/global-role.enum";

export interface CustomRequest extends Request {
  userId: string;
  role: GlobalRoleEnum;
}
