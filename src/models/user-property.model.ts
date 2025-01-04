import { Document, model, Model, Schema } from "mongoose";
import { PropertyRoleEnum } from "../enums/user-role.enum";

interface IUserProperty extends Document {
  userRef: Schema.Types.ObjectId;
  propertyRef: Schema.Types.ObjectId;
  role: PropertyRoleEnum;
}

// Combine IUserProperty and IMethods into a single type
type UserPropertyModel = Model<IUserProperty, {}>;

const userPropertySchema = new Schema<IUserProperty, UserPropertyModel>(
  {
    userRef: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    propertyRef: {
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
