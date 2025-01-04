import { PropertyRoleEnum } from "../enums/user-role.enum";
import UserProperty from "../models/user-property.model";

export const createUserProperty = async (
  userId: string,
  propertyId: string,
  role: PropertyRoleEnum
) => {
  try {
    return UserProperty.create({
      userId,
      propertyId,
      role,
    });
  } catch (error: any) {
    return null;
  }
};
