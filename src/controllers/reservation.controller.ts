import { Response } from "express";
import { ApiResponse } from "../helpers/api-response";
import { CustomRequest } from "../interfaces/custom-request.interface";
import License from "../models/license.model";
import Reservation from "../models/reservation.model";

export const CREATE_RESERVATION = async (req: CustomRequest, res: Response) => {
  try {
    const { params, body, userId } = req;
    const { propertyId } = params;

    const {
      bookerId,
      bookerType,
      licenses,
      checkInDate,
      checkOutDate,
      guests,
    } = body;

    if (!bookerId) {
      res.status(401).json(ApiResponse("Booker Id is required!", false));
      return;
    }

    if (!bookerType) {
      res.status(401).json(ApiResponse("Booker type is required!", false));
      return;
    }

    if (!checkInDate || !checkOutDate) {
      res.status(401).json(ApiResponse("Booking date range required!", false));
      return;
    }

    const reservation = await Reservation.create({
      propertyRef: propertyId,
      bookerRef: bookerId,
      bookerModel: bookerType,
      licenses: [],
      createdBy: userId,
      guestList: guests,
    });

    const licensesArr = await Promise.all(
      licenses.map(async (license: any) => {
        const createdLicense = await License.create({
          reservationId: reservation._id,
          propertyRef: propertyId,
          roomTypeRef: license?.roomTypeRef,
          guestList: [],
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          charges: {
            baseRate: license?.baseRate,
            taxAmount: license?.taxAmount,
            discountAmount: license?.discountAmount,
            totalCharges:
              license?.baseRate + license?.taxAmount - license?.discountAmount,
          },
          createdBy: userId,
        });
        return createdLicense?._id;
      })
    );

    reservation.licenses = licensesArr;

    const createdReservation = await reservation.save();

    res
      .status(201)
      .json(ApiResponse("Reservation created", true, createdReservation));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

export const GET_RESERVATION_BY_ID = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { propertyId, reservationId } = req.params;

    const reservation = await Reservation.findOne({
      propertyRef: propertyId,
      _id: reservationId,
    }).populate([
      {
        path: "propertyRef guestList bookerRef licenses licenses.guestList updatedBy",
      },
      {
        path: "createdBy",
        select: "_id name email",
      },
    ]);

    res
      .status(200)
      .json(ApiResponse("fetched successfully", true, reservation));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};
