import { Response } from "express";
import { ApiResponse } from "../helpers/api-response";
import { CustomRequest } from "../interfaces/custom-request.interface";
import License from "../models/license.model";
import Reservation from "../models/reservation.model";
import mongoose from "mongoose";
import { BOOKING_LICENSE_STATUS } from "../enums/license.enum";
import Room from "../models/room.model";

/**
 * CREATE_RESERVATION
 *
 * This controller handles the creation of a reservation for a property.
 * It creates the reservation record, associated licenses, and links them together.
 * Steps:
 * 1. Validate input data (e.g., `bookerId`, `bookerType`, `checkInDate`, `checkOutDate`, `bookingSource` `payType` ).
 * 2. Create a new reservation in the `Reservation` collection.
 * 3. Generate licenses for the reservation:
 *    - One license per room type in the `licenses` array.
 *    - Calculate charges (base rate, tax, discount, total).
 * 4. Link the generated licenses to the reservation.
 * 5. Save the reservation with linked licenses.
 * 6. Respond with the created reservation or handle errors gracefully.
 */

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
      bookingSource,
      payType,
    } = body;

    if (!bookerId) {
      res.status(401).json(ApiResponse("Booker Id is required!", false));
      return;
    }

    if (!bookerType) {
      res.status(401).json(ApiResponse("Booker type is required!", false));
      return;
    }

    if (!bookingSource) {
      res.status(401).json(ApiResponse("Booking source is required!", false));
      return;
    }

    if (!payType) {
      res.status(401).json(ApiResponse("Pay type is required!", false));
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
      bookingSource,
      payType,
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

/**
 * GET_RESERVATION_BY_ID
 *
 * This controller retrieves a reservation by its ID and the associated property ID.
 * It populates related data such as the property, guests, booker, licenses, and user details
 * (createdBy and cancelledBy) to provide a comprehensive response.
 *
 * Steps:
 * 1. Extract `propertyId` and `reservationId` from the request parameters.
 * 2. Query the `Reservation` model using `propertyId` and `reservationId`.
 * 3. Populate the following related fields:
 *    - `propertyRef`: Reference to the property.
 *    - `guestList`: List of guests associated with the reservation.
 *    - `bookerRef`: The individual or company who made the booking.
 *    - `licenses`: All licenses related to the reservation.
 *      - Populate `licenses.guestList`: Guests assigned to specific licenses.
 *    - `createdBy`: User who created the reservation, selecting `_id`, `name`, and `email`.
 *    - `cancelledBy`: User who cancelled the reservation, selecting `_id`, `name`, and `email`.
 * 4. Return the populated reservation object in the response.
 * 5. Handle errors gracefully and return a 500 status for unexpected errors.
 */

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
      {
        path: "cancelledBy",
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

/**
 * CANCEL_RESERVATION
 *
 * This controller handles the cancellation of a reservation and its associated licenses.
 * It ensures that past-dated bookings cannot be cancelled and allows cancellations with
 * or without charges, updating the appropriate fields in the reservation and license documents.
 *
 * Steps:
 * 1. Validate the `isCancelled` flag in the request body.
 * 2. Fetch the reservation using `propertyId` and `reservationId`.
 * 3. Check if any license has a `checkInDate` in the past; if so, deny cancellation.
 * 4. If valid, update licenses:
 *    - If `cancelWithCharges` is true, move charges to `cancelledCharges` and reset current charges to 0.
 *    - If `cancelWithCharges` is false, reset both current charges and `cancelledCharges` to 0.
 * 5. Update the reservation's `isCancelled` flag and `cancelledBy` field with the cancelling user's ID.
 * 6. Respond with success or error messages based on the process outcome.
 */

export const CANCEL_RESERVATION = async (req: CustomRequest, res: Response) => {
  try {
    const { propertyId, reservationId } = req.params;
    const userId = req.userId;
    const { isCancelled, cancelWithCharges } = req.body;

    if (!isCancelled) {
      res.status(400).json(ApiResponse("isCancelled flag is required", false));
      return;
    }

    // Find the reservation
    const reservation = await Reservation.findOne({
      propertyRef: propertyId,
      _id: reservationId,
    }).populate("licenses");

    if (!reservation) {
      res.status(404).json(ApiResponse("Reservation not found", false));
      return;
    }

    // Check if any license's check-in date is in the past
    const today = new Date();
    const licenses = reservation.licenses;

    const hasPastDate = licenses.some((license: any) => {
      return new Date(license.checkInDate) < today;
    });

    if (hasPastDate) {
      res
        .status(400)
        .json(ApiResponse("Past-dated bookings cannot be cancelled", false));
      return;
    }

    // Update licenses based on cancelWithCharges flag
    const updatedLicenses = await Promise.all(
      licenses.map(async (license: any) => {
        if (cancelWithCharges) {
          return License.findOneAndUpdate(
            { _id: license._id, propertyRef: propertyId },
            {
              isCancelled: true,
              "cancelledCharges.baseRate": license.charges.baseRate,
              "cancelledCharges.taxAmount": license.charges.taxAmount,
              "cancelledCharges.totalCharges": license.charges.totalCharges,
              "charges.baseRate": 0,
              "charges.taxAmount": 0,
              "charges.totalCharges": 0,
              cancelledBy: userId,
              licenseStatus: BOOKING_LICENSE_STATUS.CANCELLED,
            },
            { new: true }
          );
        } else {
          return License.findOneAndUpdate(
            { _id: license._id, propertyRef: propertyId },
            {
              isCancelled: true,
              "charges.baseRate": 0,
              "charges.taxAmount": 0,
              "charges.totalCharges": 0,
              "cancelledCharges.baseRate": 0,
              "cancelledCharges.taxAmount": 0,
              "cancelledCharges.totalCharges": 0,
              licenseStatus: BOOKING_LICENSE_STATUS.CANCELLED,
              cancelledBy: userId,
            },
            { new: true }
          );
        }
      })
    );

    const id = new mongoose.Types.ObjectId(req.userId);

    // Update the reservation
    reservation.isCancelled = true;
    reservation.cancelledBy = id;
    await reservation.save();

    res
      .status(200)
      .json(ApiResponse("Reservation cancelled successfully", true));
  } catch (error) {
    console.error(error);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

/**
 * CHECK_IN_LICENSE
 *
 * This controller handles the check-in process for a single license within a reservation.
 * Each license represents an individual room booking under a reservation.
 *
 * Steps:
 * 1. Validate input parameters:
 *    - Ensure `userId`, `propertyId`, `reservationId`, and `licenseId` are provided.
 * 2. Fetch the reservation:
 *    - Verify that the reservation exists, is associated with the specified property, and is not cancelled.
 * 3. Fetch the license:
 *    - Confirm that the license exists, belongs to the reservation, and is not cancelled.
 * 4. Validate the license for check-in:
 *    - Ensure the license's `licenseStatus` is `NOT_STARTED`.
 *    - Confirm the current date is within the license's `checkInDate` and `checkOutDate` range.
 * 5. Perform the check-in:
 *    - Update the license with:
 *      - `actualCheckInTime`: Current timestamp.
 *      - `checkedInBy`: User ID of the person performing the check-in.
 *      - `licenseStatus`: Update to `STARTED`.
 * 6. Save the updated license and return a success response.
 *
 * Error Handling:
 * - Returns appropriate error messages if:
 *   - Required parameters are missing.
 *   - The reservation or license is not found or invalid for check-in.
 *   - The license is not eligible for check-in due to its status or date constraints.
 *
 * Future Enhancements:
 * - Add audit logging for check-in actions.
 * - Include optional fields like `notes` or additional guest details during check-in.
 * - Support partial updates or validation for specific edge cases (e.g., delayed check-ins).
 */

export const CHECK_IN_LICENSE = async (req: CustomRequest, res: Response) => {
  try {
    const { propertyId, reservationId, licenseId } = req.params;
    const userId = req.userId;

    // Validate required parameters
    if (!userId) {
      res
        .status(400)
        .json(ApiResponse("User ID is required for check-in", false));
      return;
    }

    // Find the reservation
    const reservation = await Reservation.findOne({
      propertyRef: propertyId,
      _id: reservationId,
      isCancelled: false,
    });

    if (!reservation) {
      res
        .status(404)
        .json(ApiResponse("Reservation not found or already cancelled", false));
      return;
    }

    // Find the license
    const license = await License.findOne({
      _id: licenseId,
      reservationId: reservationId,
      propertyRef: propertyId,
      isCancelled: false,
    });

    if (!license) {
      res
        .status(404)
        .json(ApiResponse("License not found or already cancelled", false));
      return;
    }

    const today = new Date();

    // Validate license for check-in
    if (
      license.licenseStatus !== BOOKING_LICENSE_STATUS.NOT_STARTED ||
      new Date(license.checkInDate) > today ||
      new Date(license.checkOutDate) < today
    ) {
      res
        .status(400)
        .json(ApiResponse("License is not valid for check-in", false));
      return;
    }

    // Perform check-in
    license.actualCheckInTime = new Date();
    license.checkedInBy = new mongoose.Types.ObjectId(userId);
    license.licenseStatus = BOOKING_LICENSE_STATUS.STARTED;
    await license.save();

    res.status(200).json(ApiResponse("checked in successfully", true, license));
  } catch (error) {
    console.error(error);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

/**
 * CHECK_OUT_LICENSE
 *
 * This controller handles the check-out process for a single license within a reservation.
 * Each license represents an individual room booking under a reservation.
 *
 * Steps:
 * 1. Validate input parameters:
 *    - Ensure `userId`, `propertyId`, `reservationId`, and `licenseId` are provided.
 * 2. Fetch the reservation:
 *    - Verify that the reservation exists, is associated with the specified property, and is not cancelled.
 * 3. Fetch the license:
 *    - Confirm that the license exists, belongs to the reservation, and is not cancelled.
 * 4. Validate the license for check-out:
 *    - Ensure the license's `licenseStatus` is `STARTED` (checked-in status).
 *    - Confirm the license has not been cancelled or already checked out.
 * 5. Perform the check-out:
 *    - Update the license with:
 *      - `actualCheckOutDate`: Current timestamp.
 *      - `checkedOutBy`: User ID of the person performing the check-out.
 *      - `licenseStatus`: Update to `CLOSED`.
 * 6. Save the updated license and return a success response.
 *
 * Error Handling:
 * - Returns appropriate error messages if:
 *   - Required parameters are missing.
 *   - The reservation or license is not found or invalid for check-out.
 *   - The license is not eligible for check-out due to its status or other constraints.
 *
 * Future Enhancements:
 * - Add audit logging for check-out actions.
 * - Include additional logic for finalizing charges or generating invoices during check-out.
 * - Support additional features like partial check-outs or guest-specific notes.
 */

export const CHECK_OUT_LICENSE = async (req: CustomRequest, res: Response) => {
  try {
    const { propertyId, reservationId, licenseId } = req.params;
    const userId = req.userId;

    // Validate required parameters
    if (!userId) {
      res
        .status(400)
        .json(ApiResponse("User ID is required for check-out", false));
      return;
    }

    // Find the reservation
    const reservation = await Reservation.findOne({
      propertyRef: propertyId,
      _id: reservationId,
      isCancelled: false,
    });

    if (!reservation) {
      res
        .status(404)
        .json(ApiResponse("Reservation not found or already cancelled", false));
      return;
    }

    // Find the license
    const license = await License.findOne({
      _id: licenseId,
      reservationId: reservationId,
      propertyRef: propertyId,
      isCancelled: false,
    });

    if (!license) {
      res
        .status(404)
        .json(ApiResponse("License not found or already cancelled", false));
      return;
    }

    // Validate license for check-out
    if (license.licenseStatus !== BOOKING_LICENSE_STATUS.STARTED) {
      res
        .status(400)
        .json(ApiResponse("Room is not valid for check-out", false));
      return;
    }

    // Perform check-out
    license.actualCheckOutDate = new Date();
    license.checkedOutBy = new mongoose.Types.ObjectId(userId);
    license.licenseStatus = BOOKING_LICENSE_STATUS.CLOSED;
    await license.save();

    reservation.isClosed = true;
    reservation.updatedBy = new mongoose.Types.ObjectId(userId);
    await reservation.save();

    res
      .status(200)
      .json(ApiResponse("Checked out successfully", true, license));
  } catch (error) {
    console.error(error);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

/**
 * ASSIGN_ROOM_TO_LICENSE
 *
 * This controller assigns a specific room to a license within a reservation.
 *
 * Steps:
 * 1. Validate input parameters:
 *    - Ensure `roomId` is provided in the request body.
 * 2. Fetch the license:
 *    - Confirm the license exists, belongs to the specified reservation and property, and is not cancelled.
 * 3. Fetch the room:
 *    - Ensure the room exists and is associated with the same property as the license.
 * 4. Check room availability:
 *    - Validate that no other active licenses (`NOT_STARTED`, `STARTED`) have overlapping dates for the room.
 *    - Exclude closed (`CLOSED`) licenses as they release the room for reassignment.
 * 5. Assign the room to the license:
 *    - Update the license with `roomRef`, `assignedBy`, and `assignedAt` fields.
 * 6. Save the updated license and respond with success or error messages.
 *
 * Error Handling:
 * - Returns appropriate error messages for:
 *   - Missing or invalid `roomId`.
 *   - License or room not found.
 *   - Room unavailable for the reservation dates.
 */

export const ASSIGN_ROOM_TO_LICENSE = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { propertyId, reservationId, licenseId } = req.params;
    const { roomId } = req.body;
    const userId = new mongoose.Types.ObjectId(req.userId);

    // Validate input
    if (!roomId) {
      return res.status(400).json(ApiResponse("Room ID is required", false));
    }

    // Find the license
    const license = await License.findOne({
      _id: licenseId,
      reservationId: reservationId,
      propertyRef: propertyId,
      isCancelled: false,
    });

    if (!license) {
      return res
        .status(404)
        .json(
          ApiResponse("Room booking not found or already cancelled", false)
        );
    }

    // Find the room
    const room = await Room.findOne({
      _id: roomId,
      propertyRef: propertyId,
    });

    if (!room) {
      return res.status(404).json(ApiResponse("Room not found", false));
    }

    // Check if the room is available for assignment
    const overlappingLicense = await License.findOne({
      roomRef: roomId,
      isCancelled: false,
      licenseStatus: { $nin: ["CLOSED"] }, // Exclude closed licenses
      $or: [
        {
          checkInDate: { $lte: license.checkOutDate },
          checkOutDate: { $gte: license.checkInDate },
        },
      ],
    });

    if (overlappingLicense) {
      return res
        .status(400)
        .json(
          ApiResponse("Room is already assigned for the selected dates", false)
        );
    }

    // Assign room to license
    license.roomRef = roomId;
    license.assignmentDetails = {
      assignedAt: new Date(),
      assignedBy: userId,
    };
    await license.save();

    res
      .status(200)

      .json(ApiResponse("Room assigned successfully", true, license));
  } catch (error) {
    console.error(error);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

/**
 * UNASSIGN_ROOM_FROM_LICENSE
 *
 * This controller unassigns a room from a license within a reservation.
 *
 * Steps:
 * 1. Validate input parameters:
 *    - Ensure `propertyId`, `reservationId`, and `licenseId` are provided.
 * 2. Fetch the license:
 *    - Confirm the license exists, belongs to the specified reservation and property, and is not cancelled.
 * 3. Prevent unassignment for checked-out rooms:
 *    - If the license's `licenseStatus` is `CLOSED`, return an error.
 * 4. Perform the unassignment:
 *    - Set `roomRef` to `null`.
 *    - Clear `assignmentDetails` (e.g., `assignedBy`, `assignedAt`).
 * 5. Save the updated license and respond with success or error messages.
 *
 * Error Handling:
 * - Returns appropriate error messages for:
 *   - Missing or invalid license.
 *   - Checked-out rooms that cannot be unassigned.
 */

export const UNASSIGN_ROOM_FROM_LICENSE = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { propertyId, reservationId, licenseId } = req.params;

    // Find the license
    const license = await License.findOne({
      _id: licenseId,
      reservationId: reservationId,
      propertyRef: propertyId,
      isCancelled: false,
    });

    if (!license) {
      res
        .status(404)
        .json(ApiResponse("License not found or already cancelled", false));
      return;
    }

    // Prevent unassignment if the license is checked out
    if (license.licenseStatus === BOOKING_LICENSE_STATUS.CLOSED) {
      res
        .status(400)
        .json(ApiResponse("Checked-out rooms cannot be unassigned", false));
      return;
    }

    // Perform unassignment
    license.roomRef = null as any;
    license.assignmentDetails = null as any;
    await license.save();

    res
      .status(200)
      .json(
        ApiResponse("Room unassigned from license successfully", true, license)
      );
  } catch (error) {
    console.error(error);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};
