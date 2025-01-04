import { Document, model, Model, Schema } from "mongoose";

interface IIndividualProfile extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date; // Optional date of birth
  isSuspended: boolean; // Indicates if the profile is suspended
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  verificationDetails?: {
    idType?: string; // Type of ID (e.g., Passport, Driver's License)
    placeOfIssue?: string; // Place where the ID was issued
    issuedBy?: string; // Authority that issued the ID
    dateOfIssue?: Date; // Date when the ID was issued
    dateOfExpiry?: Date; // Expiry date of the ID
  };
  preferences?: string[]; // Optional preferences
  notes?: string; // Additional notes
  propertyRef: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
}

type IndividualProfileModel = Model<IIndividualProfile, {}>;

const IndividualProfileSchema = new Schema<
  IIndividualProfile,
  IndividualProfileModel
>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      postalCode: { type: String, trim: true },
    },
    verificationDetails: {
      idType: { type: String, trim: true },
      placeOfIssue: { type: String, trim: true },
      issuedBy: { type: String, trim: true },
      dateOfIssue: { type: Date },
      dateOfExpiry: { type: Date },
    },
    preferences: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
    },
    propertyRef: {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const IndividualProfile = model<IIndividualProfile, IndividualProfileModel>(
  "IndividualProfile",
  IndividualProfileSchema
);

export default IndividualProfile;
