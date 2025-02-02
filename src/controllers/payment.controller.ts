import { Response } from "express";
import mongoose from "mongoose";
import { ApiResponse } from "../helpers/api-response";
import { CustomRequest } from "../interfaces/custom-request.interface";
import * as PaymentService from "../services/payment.service";

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

/**
 * @swagger
 * /api/v1/pmsserver/properties/{propertyId}/reservation/{reservationId}/payments:
 *   post:
 *     summary: Add a new payment to a reservation
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the property
 *       - in: path
 *         name: reservationId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the reservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amountPaid:
 *                 type: number
 *                 description: Amount paid by the user
 *               paymentMethod:
 *                 type: string
 *                 description: Method of payment (e.g., CREDIT_CARD)
 *               referenceNumber:
 *                 type: string
 *                 description: Reference number for the payment
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *     responses:
 *       201:
 *         description: Payment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment added successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Missing or invalid fields
 *       500:
 *         description: Internal server error
 */
export const ADD_PAYMENT = async (req: CustomRequest, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const { propertyId, reservationId } = req.params;
    const { amountPaid, paymentMethod, referenceNumber, notes } = req.body;

    if (
      !propertyId ||
      !reservationId ||
      !amountPaid ||
      !paymentMethod ||
      !referenceNumber
    ) {
      res.status(400).json(ApiResponse("Missing required fields", false));
      return;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const payment = await PaymentService.addPayment(
        session,
        propertyId,
        reservationId,
        amountPaid,
        paymentMethod,
        referenceNumber,
        notes,
        userId
      );

      await session.commitTransaction();
      res
        .status(201)
        .json(ApiResponse("Payment added successfully", true, payment));
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

    if (
      !propertyId ||
      !reservationId ||
      !amountPaid ||
      !paymentMethod ||
      !referenceNumber
    ) {
      res.status(400).json(ApiResponse("Missing required fields", false));
      return;
    }

    const payment = await PaymentService.updatePayment(
      propertyId,
      reservationId,
      paymentId,
      amountPaid,
      paymentMethod,
      referenceNumber,
      notes,
      userId
    );

    if (!payment) {
      res
        .status(404)
        .json(ApiResponse("Payment not found or cannot be updated", false));
    }

    res
      .status(200)
      .json(ApiResponse("Payment updated successfully", true, payment));
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

    if (!propertyId || !reservationId || !paymentId) {
      res.status(400).json(ApiResponse("Missing required fields", false));
      return;
    }

    const payment = await PaymentService.cancelPayment(
      propertyId,
      reservationId,
      paymentId,
      userId
    );

    if (!payment) {
      res
        .status(404)
        .json(ApiResponse("Payment not found or already voided", false));
    }

    res
      .status(200)
      .json(ApiResponse("Payment voided successfully", true, payment));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};
