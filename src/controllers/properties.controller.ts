import { Response } from "express";
import { CustomRequest } from "../interfaces/custom-request.interface";
import { ApiResponse } from "../helpers/api-response";
import { NewPropertyCreationSchema } from "../schemas/properties.schema";
import {
  checkPropertyByNameAndEmail,
  createProperty,
  reverseProperty,
} from "../services/properties.service";
import { createUserProperty } from "../services/user-property.service";
import { PropertyRoleEnum } from "../enums/user-role.enum";

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
