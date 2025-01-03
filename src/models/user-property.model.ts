import { Document, model, Model, Schema } from "mongoose";
import { PropertyRoleEnum } from "../enums/user-role.enum";

interface IUserProperty extends Document {
  userId: Schema.Types.ObjectId;
  propertyId: Schema.Types.ObjectId;
  role: PropertyRoleEnum;
}

// Combine IUserProperty and IMethods into a single type
type UserPropertyModel = Model<IUserProperty, {}>;

const userPropertySchema = new Schema<IUserProperty, UserPropertyModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },
    role: {
      type: String,
      enum: PropertyRoleEnum,
      default: PropertyRoleEnum.RECEPTION,
    },
  },
  {
    timestamps: true,
  }
);

const UserProperty = model<IUserProperty, UserPropertyModel>(
  "UserProperty",
  userPropertySchema
);

export default UserProperty;
