import mongoose, { Document, model, Model, Schema, Types } from "mongoose";

interface ITax extends Document {
  name: string;
  percentage: number;
  applicableCategories: string[];
  propertyRef: Types.ObjectId;
  createdBy: Types.ObjectId;
}

type TaxModel = Model<ITax, {}>;

const TaxSchema = new Schema<ITax, TaxModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    applicableCategories: [
      {
        type: String,
        enum: ["Room", "Meal Plan", "Other"],
      },
    ],
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

const Tax = model<ITax, TaxModel>("Tax", TaxSchema);

export default Tax;
