import { Document, model, Model, Schema } from "mongoose";

interface IProperty extends Document {
  name: string;
  email: string;
  phoneNumber?: string;
  websiteURL?: string;
  mapURL?: string;
  latitude?: string;
  longitude?: string;
  address?: {
    locality?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
  checkInTime?: string;
  checkOutTime?: string;
  amenities?: string[];
  description?: string;
  policies: string[];
  images: string[];
  ratings?: number;
  reviews?: string[];
}

// Combine IProperty and IMethods into a single type
type PropertyModel = Model<IProperty, {}>;

const propertySchema = new Schema<IProperty, PropertyModel>(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    websiteURL: {
      type: String,
      lowercase: true,
      trim: true,
    },
    mapURL: {
      type: String,
      trim: true,
      lowercase: true,
    },
    latitude: {
      type: String,
      trim: true,
    },
    longitude: {
      type: String,
      trim: true,
    },
    address: {
      locality: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
      },
    },
    checkInTime: {
      type: String,
      trim: true,
    },
    checkOutTime: {
      type: String,
      trim: true,
    },
    amenities: {
      type: [String], // List of amenities like "Free WiFi", "Swimming Pool"
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    policies: {
      type: [String], // Example: "No pets allowed. Smoking is prohibited."
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: [String], // List of review IDs or strings
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Property = model<IProperty, PropertyModel>("Property", propertySchema);

export default Property;
