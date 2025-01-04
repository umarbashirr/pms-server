import { Document, model, Model, Schema } from "mongoose";

interface ICompanyProfile extends Document {
  companyName: string;
  companyCode: string; // Unique code for identifying the company
  contactEmail: string;
  contactPhone: string;
  isSuspended: boolean; // Indicates if the company is suspended
  gstDetails?: {
    beneficiaryName?: string; // Name of the GST beneficiary
    gstin?: string; // GST Identification Number
    addressLine1?: string; // GST address line 1
    addressLine2?: string; // GST address line 2
    city?: string;
    state?: string;
    postalCode?: string;
  };
  contactPerson?: {
    name?: string; // Contact person name
    phone?: string; // Contact person phone
    email?: string; // Contact person email
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  notes?: string; // Additional notes
}

type CompanyProfileModel = Model<ICompanyProfile, {}>;

const CompanyProfileSchema = new Schema<ICompanyProfile, CompanyProfileModel>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    isSuspended: {
      type: Boolean,
      default: false,
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
    contactPerson: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      email: { type: String, trim: true },
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      postalCode: { type: String, trim: true },
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const CompanyProfile = model<ICompanyProfile, CompanyProfileModel>(
  "CompanyProfile",
  CompanyProfileSchema
);

export default CompanyProfile;
