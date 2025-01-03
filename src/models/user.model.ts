import { Document, model, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

import { GlobalRoleEnum } from "../enums/global-role.enum";

interface IUser extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: GlobalRoleEnum;
}

interface IMethods {
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser, Model<IUser, IMethods>>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
      minlength: 8,
      maxlength: 30,
    },
    role: {
      type: String,
      default: GlobalRoleEnum.REGULAR_USER,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to run before saving the User
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  this.password = await bcrypt.hash(this.password, 10);
});

// Methods we can do on User
userSchema.method("comparePassword", function (password: string) {
  return bcrypt.compare(password, this.password);
});

const User = model<IUser, Model<IUser, IMethods>>("User", userSchema);

export default User;
