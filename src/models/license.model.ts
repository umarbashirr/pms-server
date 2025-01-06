import mongoose, { Schema, Document, Types } from "mongoose";
import { BOOKING_LICENSE_STATUS } from "../enums/license.enum";

// License Interface
export interface ILicense extends Document {
  reservationId: Types.ObjectId;
  propertyRef: Types.ObjectId;
  roomTypeRef: Types.ObjectId;
  roomRef?: Types.ObjectId;
  assignmentDetails?: {
    assignedAt: Date;
    assignedBy: Types.ObjectId;
  };
  guestList: {
    guestRef: Types.ObjectId;
  }[];
  charges: {
    baseRate: number;
    taxAmount: number;
    discountAmount?: number;
    totalCharges: number;
  };
  licenseStatus: BOOKING_LICENSE_STATUS;
  notes?: string;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

const LicenseSchema: Schema = new Schema(
  {
    reservationId: {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
    },
    propertyRef: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    roomTypeRef: {
      type: Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
    },
    roomRef: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    assignmentDetails: {
      assignedAt: { type: Date },
      assignedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    guestList: [
      {
        guestRef: {
          type: Schema.Types.ObjectId,
          ref: "IndividualProfile",
          required: true,
        },
      },
    ],
    charges: {
      baseRate: { type: Number, required: true },
      taxAmount: { type: Number, required: true },
      discountAmount: { type: Number, default: 0 },
      totalCharges: { type: Number, required: true },
    },
    licenseStatus: {
      type: String,
      enum: Object.values(BOOKING_LICENSE_STATUS),
      default: BOOKING_LICENSE_STATUS.NOT_STARTED,
      required: true,
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

export default mongoose.model<ILicense>("License", LicenseSchema);
