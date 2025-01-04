import { Document, model, Model, Schema } from "mongoose";

interface IRoomType extends Document {
  name: string;
  code: string;
  basePrice: number;
  maxOccupancy: number;
  description?: string;
  amenities?: string[];
  images?: string[];
  policies?: string[];
  propertyRef?: Schema.Types.ObjectId;
}

// Combine IRoomType and IMethods into a single type
type RoomTypeModel = Model<IRoomType, {}>;

const RoomTypeSchema = new Schema<IRoomType, RoomTypeModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    maxOccupancy: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      trim: true,
    },
    amenities: {
      type: [String],
      default: [], // Default empty list
    },
    images: {
      type: [String],
      default: [], // Default empty list of image URLs
    },
    policies: {
      type: [String],
      default: [], // Default empty list for room policies
    },
    propertyRef: {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },
  },
  {
    timestamps: true,
  }
);

const RoomType = model<IRoomType, RoomTypeModel>("RoomType", RoomTypeSchema);

export default RoomType;
