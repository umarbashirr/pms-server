import { Response } from "express";
import { ApiResponse } from "../helpers/api-response";
import { CustomRequest } from "../interfaces/custom-request.interface";
import PropertyFacility from "../models/property-amenities.model";
import { FacilityFormSchema } from "../schemas/facilityForm.schema";

export const CreateHotelFacility = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { propertyId } = req.params;
    const { body, userId } = req;

    const fields = FacilityFormSchema.safeParse(body);

    if (!fields.success) {
      res.status(400).json(ApiResponse("Invalid Input", false));
      return;
    }

    const { name } = fields.data;

    const facility = await PropertyFacility.create({
      name,
      propertyRef: propertyId,
      createdBy: userId,
    });

    res.status(201).json(ApiResponse("Facility Created", true, facility));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const UpdateHotelFacility = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { propertyId, facilityId } = req.params;
    const { body } = req;

    const fields = FacilityFormSchema.safeParse(body);

    if (!fields.success) {
      res.status(400).json(ApiResponse("Invalid Input", false));
      return;
    }

    const { name, isPublished } = fields.data;

    const facility = await PropertyFacility.findOneAndUpdate(
      {
        _id: facilityId,
        propertyRef: propertyId,
      },
      {
        $set: {
          name,
          isPublished,
        },
      },
      { new: true }
    );

    res.status(200).json(ApiResponse("Facility updated", true, facility));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const GetAllHotelFacilities = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { propertyId } = req.params;

    const facilities = await PropertyFacility.find({
      propertyRef: propertyId,
    }).populate([
      {
        path: "createdBy",
        select: "name",
      },
    ]);

    res.status(200).json(ApiResponse("Fetched successfully", true, facilities));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};
