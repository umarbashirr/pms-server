import { PropertyRoleEnum } from "../enums/user-role.enum";
import UserProperty from "../models/user-property.model";

export const createUserProperty = async (
  userId: string,
  propertyId: string,
  role: PropertyRoleEnum
) => {
  try {
    return UserProperty.create({
      userRef: userId,
      propertyRef: propertyId,
      role,
    });
  } catch (error: any) {
    return null;
  }
};

export const getAllPropertiesByUserId = async (id: string) => {
  try {
    return await UserProperty.find({
      userRef: id,
    }).populate("userRef propertyRef");
  } catch (error) {
    return null;
  }
};

export const getPropertyDetailsByUserId = async (
  userId: string,
  propertyId: string
) => {
  try {
    return await UserProperty.find({
      userRef: userId,
      propertyRef: propertyId,
    })
      .select("propertyRef role -_id")
      .populate("propertyRef");
  } catch (error) {
    return null;
  }
};
