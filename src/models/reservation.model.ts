import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReservation extends Document {
  propertyRef: Types.ObjectId;
  bookerRef: Types.ObjectId;
  bookerModel: "IndividualProfile" | "CompanyProfile";
  checkInDate: Date;
  checkOutDate: Date;
  isCancelled: boolean;
  licenses: Types.ObjectId[];
  paymentDetails: {
    totalAmount: number;
    totalPaid: number;
    balance: number;
  };
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
}

const ReservationSchema: Schema = new Schema(
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
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    reservationStatus: {
      type: Boolean,
      required: false,
    },
    licenses: [
      {
        type: Schema.Types.ObjectId,
        ref: "License",
      },
    ],
    paymentDetails: {
      totalAmount: {
        type: Number,
        required: true,
        default: 0,
      },
      totalPaid: {
        type: Number,
        required: true,
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IReservation>("Reservation", ReservationSchema);
