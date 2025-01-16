import { NextFunction, Response } from "express";
import { GlobalRoleEnum } from "../enums/global-role.enum";
import { PropertyRoleEnum } from "../enums/user-role.enum";
import { ApiResponse } from "../helpers/api-response";
import { CustomRequest } from "../interfaces/custom-request.interface";
import UserProperty from "../models/user-property.model";

export const VerifyUserAdminAccess = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, role } = req;
    const { propertyId } = req.params;

    if (role === GlobalRoleEnum.BOT) {
      next();
    } else {
      const userProperty = await UserProperty.findOne({
        propertyRef: propertyId,
        userRef: userId,
      });

      if (!userProperty) {
        res.status(401).json(ApiResponse("Un-authorized", false));
        return;
      }

      if (
        role !== GlobalRoleEnum.SUPER_ADMIN &&
        userProperty.role !== PropertyRoleEnum.ADMIN
      ) {
        res
          .status(401)
          .json(
            ApiResponse(
              "You are not authorzied to complete this request!",
              false
            )
          );
        return;
      }

      next();
    }
  } catch (error) {
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};
