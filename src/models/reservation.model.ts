import mongoose, { Schema, Document, Types } from "mongoose";
import {
  ReservationPayTypeEnum,
  ReservationSourceEnum,
} from "../enums/reservation.enum";

export interface IReservation extends Document {
  propertyRef: Types.ObjectId;
  bookerRef: Types.ObjectId;
  bookerModel: "IndividualProfile" | "CompanyProfile";
  isCancelled: boolean;
  licenses: Types.ObjectId[];
  paymentDetails: {
    totalAmount: number;
    totalPaid: number;
    balance: number;
  };
  guestList: Types.ObjectId[];
  gstDetails?: {
    beneficiaryName: string;
    gstin: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  gstOtherThanBooker: boolean;
  notes?: string;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  bookingSource: ReservationSourceEnum;
  payType: ReservationPayTypeEnum;
  cancelledBy: Types.ObjectId;
  isClosed: boolean;
  payments: Types.ObjectId[];
}

const ReservationSchema: Schema = new Schema<IReservation>(
  {
    propertyRef: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    bookerRef: {
      type: Schema.Types.ObjectId,
      refPath: "bookerModel",
      required: true,
    },
    bookerModel: {
      type: String,
      enum: ["IndividualProfile", "CompanyProfile"],
    },

    isCancelled: {
      type: Boolean,
      default: false,
    },
    licenses: [
      {
        type: Schema.Types.ObjectId,
        ref: "License",
      },
    ],
    guestList: [
      {
        type: Schema.Types.ObjectId,
        ref: "IndividualProfile",
        required: true,
      },
    ],
    paymentDetails: {
      totalAmount: {
        type: Number,
        default: 0,
      },
      totalPaid: {
        type: Number,
        default: 0,
      },
      balance: {
        type: Number,
      },
    },
    gstDetails: {
      beneficiaryName: { type: String, trim: true },
      gstin: { type: String, trim: true },
      addressLine1: { type: String, trim: true },
      addressLine2: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      postalCode: { type: String, trim: true },
    },
    gstOtherThanBooker: {
      type: Boolean,
      default: false,
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
    bookingSource: {
      type: String,
      enum: Object.keys(ReservationSourceEnum),
    },
    payType: {
      type: String,
      enum: Object.keys(ReservationPayTypeEnum),
    },
    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model<IReservation>(
  "Reservation",
  ReservationSchema
);

export default Reservation;
