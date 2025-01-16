import mongoose, { Document, model, Model, Schema, Types } from "mongoose";

interface IPropertyFacility extends Document {
  name: string;
  isPublished: boolean;
  propertyRef: Types.ObjectId;
  createdBy: Types.ObjectId;
}

// Combine IPropertyFacility and IMethods into a single type
type PropertyFacilityModel = Model<IPropertyFacility, {}>;

const propertyFacility = new Schema<IPropertyFacility, PropertyFacilityModel>(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    propertyRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const PropertyFacility = model<IPropertyFacility, PropertyFacilityModel>(
  "PropertyFacility",
  propertyFacility
);

export default PropertyFacility;
