import { Response } from "express";
import { CustomRequest } from "../interfaces/custom-request.interface";
import { ApiResponse } from "../helpers/api-response";
import mongoose, { Types } from "mongoose";
import Payment from "../models/payment.model";
import Reservation from "../models/reservation.model";

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

    const reservation = await Reservation.findOne({
      _id: reservationId,
      propertyRef: propertyId,
    });

    if (!reservation) {
      res.status(400).json(ApiResponse("No reservation found", false));
      return;
    }

    const payment = await Payment.create({
      reservationRef: reservationId,
      propertyRef: propertyId,
      amountPaid,
      paymentMethod,
      referenceNumber,
      notes,
      createdBy: userId,
    });

    reservation.payments.push(payment._id as Types.ObjectId);
    await reservation.save();

    res.status(201).json(ApiResponse("Payment added successfully", true));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

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
        reservationRef: reservationId,
        propertyRef: propertyId,
        amountPaid,
        paymentMethod,
        referenceNumber,
        notes,
        updatedBy: userId,
      },

      {
        new: true,
      }
    );

    if (!payment) {
      res.status(400).json(ApiResponse("Cannot update payment", false));
    }

    res.status(200).json(ApiResponse("Payment updated successfully", true));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};

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
        isVoid: true,
        updatedBy: userId,
      },

      {
        new: true,
      }
    );

    if (!payment) {
      res.status(400).json(ApiResponse("Cannot update payment", false));
    }

    res.status(200).json(ApiResponse("Payment voided successfully", true));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json(ApiResponse("Internal Server Error", false));
  }
};
