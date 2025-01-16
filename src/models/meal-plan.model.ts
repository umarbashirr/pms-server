import mongoose, { Document, model, Model, Schema, Types } from "mongoose";

interface IMealPlan extends Document {
  name: string;
  code: string;
  price: number;
  description: string;
  propertyRef: Types.ObjectId;
  createdBy: Types.ObjectId;
}

// Combine IMealPlan and IMethods into a single type
type MealPlanModel = Model<IMealPlan, {}>;

const MealPlanSchema = new Schema<IMealPlan, MealPlanModel>(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
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

const MealPlan = model<IMealPlan, MealPlanModel>("MealPlan", MealPlanSchema);

export default MealPlan;
