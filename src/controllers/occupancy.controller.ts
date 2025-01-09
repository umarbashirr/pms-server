import { ApiResponse } from "../helpers/api-response";
import { CustomRequest } from "../interfaces/custom-request.interface";
import { Response } from "express";
import RoomType from "../models/room-types.model";
import Room from "../models/room.model";
import License from "../models/license.model";

export const GET_OCCUPANCY = async (req: CustomRequest, res: Response) => {
  try {
    const { query, params } = req;

    // Checkin Date & Checkout Date MM/DD/YYYY
    const { checkInDate, checkOutDate } = query;
    const { propertyId } = params;

    if (!checkInDate || !checkOutDate || !propertyId) {
      res.status(400).json(ApiResponse("Invalid request", false));
      return;
    }

    const checkIn = new Date(checkInDate as string);
    const checkOut = new Date(checkOutDate as string);

    if (checkIn >= checkOut) {
      res.status(400).json(ApiResponse("Invalid date range", false));
      return;
    }

    // Fetch hotel all room types
    const roomTypes = await RoomType.find({
      propertyRef: propertyId,
    });

    if (!roomTypes || roomTypes.length === 0) {
      res
        .status(401)
        .json(ApiResponse("No rooms found in this property", false));
      return;
    }

    // Check Availability
    const availability = await Promise.all(
      // Looping from roomTypes
      roomTypes.map(async (roomType) => {
        const totalRooms = await Room.countDocuments({
          propertyRef: propertyId,
          roomTypeRef: roomType._id,
        });

        console.log(roomType.name, +"=" + totalRooms);

        const bookedRooms = await License.countDocuments({
          propertyRef: propertyId,
          roomTypeRef: roomType._id,
          $or: [
            {
              checkInDate: {
                $lte: checkOut,
              },
              checkOutDate: {
                $gte: checkIn,
              },
            },
          ],
        });

        console.log(roomType.name, +"=" + bookedRooms);

        const availableRooms = Math.max(0, totalRooms - bookedRooms);

        return {
          roomType,
          availableRooms,
        };
      })
      // End of Loop
    );

    res.status(200).json({
      checkInDate,
      checkOutDate,
      availability,
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};
