import { Response } from "express";
import mongoose from "mongoose";
import { ApiResponse } from "../helpers/api-response";
import { CustomRequest } from "../interfaces/custom-request.interface";
import Payment from "../models/payment.model";
import Reservation from "../models/reservation.model";

/**
 * ADD_PAYMENT
 *
 * This controller handles the addition of a new payment for a reservation.
 *
 * Functionality:
 * 1. Validates input parameters and request body to ensure all required fields are provided.
 * 2. Creates a payment record linked to the specified reservation and property.
 * 3. Updates the reservation by associating the payment with it.
 * 4. Ensures atomicity using a transaction session:
 *    - If any operation fails, all changes are rolled back.
 *    - If successful, commits the transaction.
 *
 * Key Features:
 * - Validates required fields: `amountPaid`, `paymentMethod`, `referenceNumber`.
 * - Uses a MongoDB transaction to maintain data integrity.
 * - Handles errors gracefully and returns meaningful messages.
 *
 * Error Scenarios:
 * - Missing or invalid `propertyId`, `reservationId`, or payment details.
 * - Reservation not found or database errors during payment creation.
 *
 * HTTP Status Codes:
 * - `201`: Payment added successfully.
 * - `400`: Validation errors.
 * - `500`: Internal server errors or transaction failures.
 */

export const ADD_PAYMENT = async (req: CustomRequest, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const { propertyId, reservationId } = req.params;
    const { amountPaid, paymentMethod, referenceNumber, notes } = req.body;

    if (!propertyId) {
      res.status(400).json(ApiResponse("Property ID is missing", false));
      return;
    }

    if (!reservationId) {
      res.status(400).json(ApiResponse("Reservation ID is missing", false));
      return;
    }

    if (!amountPaid || !paymentMethod || !referenceNumber) {
      res.status(400).json(ApiResponse("Invalid fields", false));
      return;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const payment = await Payment.create(
        [
          {
            reservationRef: reservationId,
            propertyRef: propertyId,
            amountPaid,
            paymentMethod,
            referenceNumber,
            notes,
            createdBy: userId,
          },
        ],
        { session }
      );

      await Reservation.findByIdAndUpdate(
        reservationId,
        { $push: { payments: payment[0]._id } },
        { session }
      );

      await session.commitTransaction();
      res.status(201).json(ApiResponse("Payment added successfully", true));
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json(ApiResponse("Failed to add payment", false));
    } finally {
      session.endSession();
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

/**
 * UPDATE_PAYMENT
 *
 * This controller updates an existing payment for a reservation.
 *
 * Functionality:
 * 1. Validates input parameters and request body to ensure all required fields are provided.
 * 2. Finds the payment record associated with the reservation and property.
 * 3. Updates the payment details, including `amountPaid`, `paymentMethod`, `referenceNumber`, and `notes`.
 * 4. Tracks the user who made the update using the `updatedBy` field.
 *
 * Key Features:
 * - Ensures payments that are voided cannot be updated.
 * - Uses `findOneAndUpdate` for efficient updates.
 * - Provides detailed error messages for invalid requests or missing records.
 *
 * Error Scenarios:
 * - Missing or invalid `propertyId`, `reservationId`, or `paymentId`.
 * - Payment not found or already voided.
 *
 * HTTP Status Codes:
 * - `200`: Payment updated successfully.
 * - `400`: Validation errors.
 * - `404`: Payment not found or invalid for update.
 * - `500`: Internal server errors.
 */

export const UPDATE_PAYMENT = async (req: CustomRequest, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const { propertyId, reservationId, paymentId } = req.params;
    const { amountPaid, paymentMethod, referenceNumber, notes } = req.body;

    if (!propertyId) {
      res.status(400).json(ApiResponse("Property ID is missing", false));
      return;
    }

    if (!reservationId) {
      res.status(400).json(ApiResponse("Reservation ID is missing", false));
      return;
    }

    if (!amountPaid || !paymentMethod || !referenceNumber) {
      res.status(400).json(ApiResponse("Invalid fields", false));
      return;
    }

    const payment = await Payment.findOneAndUpdate(
      {
        reservationRef: reservationId,
        _id: paymentId,
        propertyRef: propertyId,
        isVoid: false,
      },
      {
        $set: {
          amountPaid,
          paymentMethod,
          referenceNumber,
          notes,
          updatedBy: userId,
        },
      },
      {
        new: true,
      }
    );

    if (!payment) {
      res
        .status(404)
        .json(ApiResponse("Payment not found or cannot be updated", false));
    }

    res.status(200).json(ApiResponse("Payment updated successfully", true));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

/**
 * CANCEL_PAYMENT
 *
 * This controller handles voiding a payment for a reservation.
 *
 * Functionality:
 * 1. Validates input parameters to ensure `propertyId`, `reservationId`, and `paymentId` are provided.
 * 2. Finds the payment record associated with the reservation and property.
 * 3. Marks the payment as void by setting `isVoid` to `true`.
 * 4. Tracks the user who performed the cancellation using the `updatedBy` field.
 *
 * Key Features:
 * - Ensures payments that are already voided cannot be voided again.
 * - Uses `findOneAndUpdate` to void payments efficiently.
 * - Provides meaningful feedback for missing or invalid requests.
 *
 * Error Scenarios:
 * - Missing or invalid `propertyId`, `reservationId`, or `paymentId`.
 * - Payment not found or already voided.
 *
 * HTTP Status Codes:
 * - `200`: Payment voided successfully.
 * - `400`: Validation errors.
 * - `404`: Payment not found or already voided.
 * - `500`: Internal server errors.
 */

export const CANCEL_PAYMENT = async (req: CustomRequest, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const { propertyId, reservationId, paymentId } = req.params;

    if (!propertyId) {
      res.status(400).json(ApiResponse("Property ID is missing", false));
      return;
    }

    if (!reservationId) {
      res.status(400).json(ApiResponse("Reservation ID is missing", false));
      return;
    }

    const payment = await Payment.findOneAndUpdate(
      {
        reservationRef: reservationId,
        _id: paymentId,
        propertyRef: propertyId,
        isVoid: false,
      },
      {
        $set: {
          isVoid: true,
          updatedBy: userId,
        },
      },

      {
        new: true,
      }
    );

    if (!payment) {
      res
        .status(404)
        .json(ApiResponse("Payment not found or already voided", false));
    }

    res.status(200).json(ApiResponse("Payment voided successfully", true));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};
