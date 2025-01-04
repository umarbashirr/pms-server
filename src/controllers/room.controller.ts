import { CustomRequest } from "../interfaces/custom-request.interface";
import { Response } from "express";
import Room from "../models/room.model";
import { ApiResponse } from "../helpers/api-response";
import { roomSchema } from "../schemas/room.schema";
import RoomType from "../models/room-types.model";

export const CREATE_ROOM = async (req: CustomRequest, res: Response) => {
  try {
    const { body, params } = req;
    const { propertyId } = params;

    const fields = roomSchema.safeParse(body);

    if (!fields.success) {
      res.status(401).json(ApiResponse("Invalid fields provided!", false));
      return;
    }

    const category = await RoomType.findById(fields.data.roomTypeRef);

    if (!category) {
      res.status(404).json(ApiResponse("No such room type found!", false));
      return;
    }

    const room = await Room.create({
      roomNumber: fields.data.roomNumber,
      roomCode: category.code + " " + fields.data.roomNumber,
      roomTypeRef: category._id,
      propertyRef: propertyId,
      floor: fields.data.floor,
    });

    res.status(201).json(ApiResponse("Created successfully!", true, room));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const UPDATE_ROOM = async (req: CustomRequest, res: Response) => {
  try {
    const { body, params } = req;
    const { propertyId, roomId } = params;

    const fields = roomSchema.safeParse(body);

    if (!fields.success) {
      res.status(401).json(ApiResponse("Invalid fields provided!", false));
      return;
    }

    const category = await RoomType.findById(fields.data.roomTypeRef);

    if (!category) {
      res.status(404).json(ApiResponse("No such room type found!", false));
      return;
    }

    const room = await Room.findOneAndUpdate(
      {
        _id: roomId,
        propertyRef: propertyId,
        roomTypeRef: fields.data.roomTypeRef,
      },
      {
        roomNumber: fields.data.roomNumber,
        roomCode: category.code + " " + fields.data.roomNumber,
        roomTypeRef: category._id,
        floor: fields.data.floor,
      }
    );

    if (!room) {
      res.status(401).json(ApiResponse("Oops! Something went wrong", false));
      return;
    }

    res.status(200).json(ApiResponse("Updated successfully!", true));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const GET_ALL_ROOMS = async (req: CustomRequest, res: Response) => {
  try {
    const { propertyId } = req.params;

    let rooms = await Room.find({
      propertyRef: propertyId,
    }).populate("roomTypeRef");

    res.status(200).json(ApiResponse("Fetched successfully", true, rooms));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const GET_ROOM_BY_ID = async (req: CustomRequest, res: Response) => {
  try {
    const { roomId } = req.params;

    let room = await Room.findById(roomId).populate("roomTypeRef");

    res.status(200).json(ApiResponse("Fetched successfully", true, room));
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};
