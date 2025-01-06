import { CustomRequest } from "../interfaces/custom-request.interface";
import { Response } from "express";
import IndividualProfile from "../models/individual-profile.model";
import CompanyProfile from "../models/company-profile.model";
import {
  individualProfileSchema,
  companyProfileSchema,
} from "../schemas/profiles.schema";
import { ApiResponse } from "../helpers/api-response";
import { Types } from "mongoose";

export const CREATE_INDIVIDUAL_PROFILE = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { body, userId, params } = req;
    const { propertyId } = params;

    const fields = individualProfileSchema.safeParse(body);

    if (!fields.success) {
      res.status(401).json(ApiResponse("Invalid fields provided!", false));
      return;
    }

    const data = fields.data;

    const existingProfile = await IndividualProfile.findOne({
      email: data.email,
      propertyRef: propertyId,
    });

    if (existingProfile) {
      res
        .status(409)
        .json(ApiResponse("Email already in use for profile!", false));
      return;
    }

    const profile = await IndividualProfile.create({
      ...data,
      propertyRef: propertyId,
      createdBy: userId,
    });

    res.status(201).json(ApiResponse("Created successfully!", true, profile));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const UPDATE_INDIVIDUAL_PROFILE = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { body, params } = req;
    const { propertyId, profileId } = params;

    const fields = individualProfileSchema.safeParse(body);

    if (!fields.success) {
      console.log(fields.error.flatten().fieldErrors);
      res.status(401).json(ApiResponse("Invalid fields provided!", false));
      return;
    }

    const data = fields.data;

    const profile = await IndividualProfile.findOneAndUpdate(
      {
        _id: profileId,
        propertyRef: propertyId,
      },
      {
        ...data,
      },
      {
        new: true,
      }
    );

    res.status(200).json(ApiResponse("updated successfully!", true, profile));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const GET_INDIVIDUAL_PROFILE = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { email, profileId, firstName, lastName, phoneNumber } = req.query;
    const { propertyId } = req.params;

    const query: any = {
      propertyRef: propertyId,
      $and: [],
    };

    if (email) {
      query.$and.push({ email });
    }

    if (profileId) {
      query.$and.push({ _id: profileId });
    }

    if (firstName) {
      query.$and.push({
        firstName: { $regex: firstName as string, $options: "i" },
      });
    }

    if (lastName) {
      query.$and.push({
        lastName: { $regex: lastName as string, $options: "i" },
      });
    }

    if (phoneNumber) {
      query.$and.push({ phone: phoneNumber });
    }

    // If no valid query parameters are provided, avoid querying
    if (query.$and.length === 0) {
      return res
        .status(400)
        .json(ApiResponse("No valid query parameters provided", false));
    }

    // Execute query
    const profiles = await IndividualProfile.find(query);

    res.status(200).json(ApiResponse("Fetched Successfully", true, profiles));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const CREATE_COMPANY_PROFILE = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { body, userId, params } = req;
    const { propertyId } = params;

    const fields = companyProfileSchema.safeParse(body);

    if (!fields.success) {
      res.status(401).json(ApiResponse("Invalid fields provided!", false));
      return;
    }

    const data = fields.data;

    const existingProfile = await CompanyProfile.findOne({
      email: data.contactEmail,
      propertyRef: propertyId,
    });

    if (existingProfile) {
      res
        .status(409)
        .json(ApiResponse("Email already in use for profile!", false));
      return;
    }

    const profile = await CompanyProfile.create({
      ...data,
      propertyRef: propertyId,
      createdBy: userId,
    });

    res.status(201).json(ApiResponse("Created successfully!", true, profile));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const UPDATE_COMPANY_PROFILE = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { body, params } = req;
    const { propertyId, profileId } = params;

    const fields = companyProfileSchema.safeParse(body);

    if (!fields.success) {
      res.status(401).json(ApiResponse("Invalid fields provided!", false));
      return;
    }

    const data = fields.data;

    const profile = await CompanyProfile.findOneAndUpdate(
      {
        _id: profileId,
        propertyRef: propertyId,
      },
      {
        ...data,
      },
      {
        new: true,
      }
    );

    res.status(200).json(ApiResponse("updated successfully!", true, profile));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const GET_COMPANY_PROFILE = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { contactEmail, profileId, companyName, companyCode } = req.query;
    const { propertyId } = req.params;

    const query: any = { propertyRef: propertyId };

    if (contactEmail) {
      query.contactEmail = contactEmail;
    }

    if (profileId && Types.ObjectId.isValid(profileId as string)) {
      query._id = profileId;
    }

    if (companyName) {
      query.companyName = { $regex: companyName as string, $options: "i" };
    }

    if (companyCode) {
      query.companyCode = companyCode;
    }

    if (Object.keys(query).length === 1) {
      return res
        .status(400)
        .json(ApiResponse("No valid query parameters provided", false));
    }

    // Execute query
    const profiles = await CompanyProfile.find(query);

    res.status(200).json(ApiResponse("Fetched Successfully", true, profiles));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};
