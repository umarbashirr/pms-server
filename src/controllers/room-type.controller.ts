import { Response } from "express";
import { ApiResponse } from "../helpers/api-response";
import { CustomRequest } from "../interfaces/custom-request.interface";
import RoomType from "../models/room-types.model";
import { RoomTypeSchema } from "../schemas/room-type.schema";

export const CREATE_PROPERTY_ROOM_TYPE = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { body, params } = req;
    const { propertyId } = params;

    // Validate user inputs
    const fields = RoomTypeSchema.safeParse(body);

    if (!fields.success) {
      res.status(400).json(ApiResponse("Check provided inputs", false));
      return;
    }

    const IssueData = fields.data;

    // Check for existing room type
    const existingRoomType = await RoomType.findOne({
      code: IssueData.code.toUpperCase(),
      propertyRef: propertyId,
    });

    if (existingRoomType) {
      res.status(409).json(ApiResponse("Duplicate entry", false));
      return;
    }

    // Create New Property with name and email
    const roomType = await RoomType.create({
      ...IssueData,
      propertyRef: propertyId,
    });

    if (!roomType) {
      res.status(400).json(ApiResponse("Error while creating property", false));
      return;
    }

    res
      .status(201)
      .json(ApiResponse("Room type created successfully!", true, roomType));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const GET_ALL_ROOM_TYPES = async (req: CustomRequest, res: Response) => {
  try {
    const { propertyId } = req.params;

    let roomTypes = await RoomType.find({
      propertyRef: propertyId,
    });

    res.status(200).json(ApiResponse("Fetched successfully", true, roomTypes));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const GET_ROOM_TYPE_BY_ID = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { roomTypeId } = req.params;

    let roomType = await RoomType.findById(roomTypeId);

    res.status(200).json(ApiResponse("Fetched successfully", true, roomType));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const UPDATE_ROOM_TYPE = async (req: CustomRequest, res: Response) => {
  try {
    const { body, params } = req;
    const { propertyId, roomTypeId } = params;

    const fields = RoomTypeSchema.safeParse(body);

    if (!fields.success) {
      res.status(401).json(ApiResponse("Invalid fields data!", false));
      return;
    }

    const updatedRoomType = await RoomType.findOneAndUpdate(
      { _id: roomTypeId, propertyRef: propertyId },
      {
        ...fields.data,
      },
      { new: true }
    );

    if (!updatedRoomType) {
      res
        .status(401)
        .json(ApiResponse("Error while updating property details!", false));
      return;
    }

    res
      .status(200)
      .json(
        ApiResponse(
          "Room type details updated successfully!",
          true,
          updatedRoomType
        )
      );
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};
