import mongoose, { Schema, Document, Types } from "mongoose";
import { PAYMENTENUM } from "../enums/payment.enum";

export interface IPayment extends Document {
  reservationRef: Types.ObjectId;
  propertyRef: Types.ObjectId;
  amountPaid: number;
  paymentMethod: PAYMENTENUM;
  isVoid: boolean;
  transactionDate: Date;
  referenceNumber?: string;
  notes?: string;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    reservationRef: {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
    },
    propertyRef: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENTENUM),
      required: true,
    },
    isVoid: {
      type: Boolean,
      required: true,
      default: false,
    },
    transactionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    referenceNumber: {
      type: String,
    },
    notes: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
