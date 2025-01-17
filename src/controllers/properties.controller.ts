import { Response } from "express";
import { GlobalRoleEnum } from "../enums/global-role.enum";
import { PropertyRoleEnum } from "../enums/user-role.enum";
import { ApiResponse } from "../helpers/api-response";
import { CustomRequest } from "../interfaces/custom-request.interface";
import Property from "../models/property.model";
import UserProperty from "../models/user-property.model";
import User from "../models/user.model";
import { RegisterToPropertySchema } from "../schemas/auth.schema";
import {
  NewPropertyCreationSchema,
  propertyZodSchema,
} from "../schemas/properties.schema";
import {
  checkPropertyByNameAndEmail,
  createProperty,
  getAllProperties,
  getSinglePropertyById,
  reverseProperty,
} from "../services/properties.service";
import {
  createUserProperty,
  getAllPropertiesByUserId,
  getPropertyDetailsByUserId,
} from "../services/user-property.service";
import mongoose from "mongoose";

export const CREATE_NEW_PROPERTY = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    // Validate user inputs
    const fields = NewPropertyCreationSchema.safeParse(req.body);

    if (!fields.success) {
      res.status(400).json(ApiResponse("Check provided inputs", false));
      return;
    }

    const { name, email } = fields.data;

    // Check for existing property
    const existingProperty = await checkPropertyByNameAndEmail(name, email);

    if (existingProperty) {
      res.status(409).json(ApiResponse("Duplicate entry", false));
      return;
    }

    // Create New Property with name and email
    const property = await createProperty(name, email);

    if (!property) {
      res.status(400).json(ApiResponse("Error while creating property", false));
      return;
    }

    // Link user to property as admin
    const userProperty = await createUserProperty(
      userId,
      property._id as string,
      PropertyRoleEnum.ADMIN
    );

    if (!userProperty) {
      res
        .status(400)
        .json(ApiResponse("Error while creating user property", false));

      // If by any reason linking fail delete the recently created property
      await reverseProperty(property._id as string);
      return;
    }

    res
      .status(201)
      .json(ApiResponse("Property created successfully!", true, property));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const GET_ALL_PROPERTIES = async (req: CustomRequest, res: Response) => {
  try {
    const { userId, role } = req;

    let properties;

    if (role === GlobalRoleEnum.BOT) {
      properties = await getAllProperties();
    } else {
      properties = await getAllPropertiesByUserId(userId);
    }

    if (!properties) {
      res.status(200).json(ApiResponse("Fetched successfully", true, []));
      return;
    }

    res.status(200).json(ApiResponse("Fetched successfully", true, properties));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const GET_PROPERTY_DETAILS_BY_USER_ID = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { userId, role } = req;
    const { propertyId } = req.params;

    let property;

    if (role === GlobalRoleEnum.BOT) {
      property = await getSinglePropertyById(propertyId);
    } else {
      property = await getPropertyDetailsByUserId(userId, propertyId);
    }

    if (!property) {
      res.status(404).json(ApiResponse("Error while fetching..", false));
      return;
    }

    res.status(200).json(ApiResponse("Fetched successfully", true, property));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const UPDATE_USER_PROPERTY = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { body, role, userId } = req;
    const { propertyId } = req.params;
    let userProperty;
    if (role === GlobalRoleEnum.BOT) {
      userProperty = await UserProperty.findOne({
        propertyRef: propertyId,
      })
        .select("propertyRef role -_id")
        .populate("propertyRef");
    } else {
      userProperty = await getPropertyDetailsByUserId(userId, propertyId);
    }

    if (!userProperty) {
      res.status(400).json(ApiResponse("No such property found!", false));
      return;
    }

    const userPropertyRole = userProperty.role;

    if (
      role !== GlobalRoleEnum.BOT &&
      role !== GlobalRoleEnum.SUPER_ADMIN &&
      userPropertyRole !== PropertyRoleEnum.ADMIN
    ) {
      res
        .status(401)
        .json(
          ApiResponse("You are not authorzied to complete this request!", false)
        );
      return;
    }

    const fields = propertyZodSchema.safeParse(body);

    if (!fields.success) {
      res.status(401).json(ApiResponse("Invalid fields data!", false));
      return;
    }

    const updatedProperty = await Property.findOneAndUpdate(
      { _id: propertyId },
      {
        $set: {
          ...fields.data,
        },
      },
      { new: true }
    );

    if (!updatedProperty) {
      res
        .status(401)
        .json(ApiResponse("Error while updating property details!", false));
      return;
    }

    res
      .status(200)
      .json(
        ApiResponse(
          "Property details updated successfully!",
          true,
          updatedProperty
        )
      );
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const AddUserToProperty = async (req: CustomRequest, res: Response) => {
  try {
    const { body, params } = req;

    const { propertyId } = params;
    const fields = RegisterToPropertySchema.safeParse(body);

    if (!fields.success) {
      res.status(400).json(ApiResponse("Missing or invalid input", false));
      return;
    }

    const { name, email, password, phoneNumber, role } = fields.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json(ApiResponse("Email is already registered", false));
    }

    const user = await User.create({
      name,
      email,
      phoneNumber,
      password,
    });

    const userProperty = await UserProperty.create({
      role,
      propertyRef: propertyId,
      userRef: user._id,
    });

    res.status(201).json(ApiResponse("Access Given", true));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const GetUsersByProperty = async (req: CustomRequest, res: Response) => {
  try {
    const { propertyId } = req.params;

    const users = await UserProperty.find({ propertyRef: propertyId }).populate(
      "userRef",
      "name email phoneNumber role"
    );

    res
      .status(200)
      .json(ApiResponse("Users fetched successfully!", true, users));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};
