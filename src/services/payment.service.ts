import mongoose from "mongoose";
import Payment from "../models/payment.model";
import Reservation from "../models/reservation.model";

// Add a payment
export const addPayment = async (
  session: mongoose.ClientSession,
  propertyId: string,
  reservationId: string,
  amountPaid: number,
  paymentMethod: string,
  referenceNumber: string,
  notes: string,
  userId: mongoose.Types.ObjectId
) => {
  // Create a payment
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

  // Update reservation with the new payment reference
  await Reservation.findByIdAndUpdate(
    reservationId,
    { $push: { payments: payment[0]._id } },
    { session }
  );

  return payment[0];
};

// Update a payment
export const updatePayment = async (
  propertyId: string,
  reservationId: string,
  paymentId: string,
  amountPaid: number,
  paymentMethod: string,
  referenceNumber: string,
  notes: string,
  userId: mongoose.Types.ObjectId
) => {
  return Payment.findOneAndUpdate(
    {
      _id: paymentId,
      reservationRef: reservationId,
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
    { new: true }
  );
};

// Cancel a payment
export const cancelPayment = async (
  propertyId: string,
  reservationId: string,
  paymentId: string,
  userId: mongoose.Types.ObjectId
) => {
  return Payment.findOneAndUpdate(
    {
      _id: paymentId,
      reservationRef: reservationId,
      propertyRef: propertyId,
      isVoid: false,
    },
    {
      $set: {
        isVoid: true,
        updatedBy: userId,
      },
    },
    { new: true }
  );
};
