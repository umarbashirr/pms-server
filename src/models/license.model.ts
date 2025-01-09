import mongoose, { Schema, Document, Types } from "mongoose";
import { BOOKING_LICENSE_STATUS } from "../enums/license.enum";

// License Interface
export interface ILicense extends Document {
  reservationId: Types.ObjectId;
  propertyRef: Types.ObjectId;
  roomTypeRef: Types.ObjectId;
  roomRef?: Types.ObjectId;
  assignmentDetails?: {
    assignedAt: Date | null;
    assignedBy: Types.ObjectId | null;
  };
  guestList: {
    guestRef: Types.ObjectId;
  }[];
  checkInDate: Date;
  checkOutDate: Date;
  charges: {
    baseRate: number;
    taxAmount: number;
    discountAmount?: number;
    totalCharges: number;
  };
  cancelledCharges: {
    baseRate: number;
    taxAmount: number;
    totalCharges: number;
  };
  licenseStatus: BOOKING_LICENSE_STATUS;
  notes?: string;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isCancelled: boolean;
  actualCheckInTime: Date;
  actualCheckOutDate: Date;
  checkedInBy: Types.ObjectId;
  checkedOutBy: Types.ObjectId;
  cancelledBy: Types.ObjectId;
}

const LicenseSchema: Schema = new Schema<ILicense>(
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
      default: null,
    },
    assignmentDetails: {
      assignedAt: { type: Date, default: null },
      assignedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    },
    guestList: [
      {
        guestRef: {
          type: Schema.Types.ObjectId,
          ref: "IndividualProfile",
        },
      },
    ],
    checkInDate: Date,
    checkOutDate: Date,
    charges: {
      baseRate: { type: Number, required: true },
      taxAmount: { type: Number, required: true },
      discountAmount: { type: Number, default: 0 },
      totalCharges: { type: Number, required: true },
    },
    cancelledCharges: {
      baseRate: { type: Number },
      taxAmount: { type: Number },
      totalCharges: { type: Number },
    },
    licenseStatus: {
      type: String,
      enum: Object.values(BOOKING_LICENSE_STATUS),
      default: BOOKING_LICENSE_STATUS.NOT_STARTED,
    },
    actualCheckInTime: Date,
    actualCheckOutDate: Date,
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
    isCancelled: {
      type: Boolean,
      default: false,
    },
    checkedInBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    checkedOutBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const License = mongoose.model<ILicense>("License", LicenseSchema);

export default License;
