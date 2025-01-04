import Property from "../models/property.model";
import UserProperty from "../models/user-property.model";

export const checkPropertyByNameAndEmail = async (
  name: string,
  email: string
) => {
  try {
    return await Property.findOne({
      name: name.toLowerCase(),
      email: email.toLowerCase(),
    });
  } catch (error: any) {
    return null;
  }
};

export const createProperty = async (name: string, email: string) => {
  try {
    const property = await Property.create({
      name,
      email,
    });

    return property;
  } catch (error: any) {
    return null;
  }
};

export const reverseProperty = async (id: string) => {
  return await Property.deleteOne({
    _id: id,
  });
};

export const getAllProperties = async () => {
  try {
    return await Property.find({});
  } catch (error) {
    return null;
  }
};

export const getSinglePropertyById = async (id: string) => {
  try {
    return await Property.findById(id);
  } catch (error) {
    return null;
  }
};
