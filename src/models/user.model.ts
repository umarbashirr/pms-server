import { Document, model, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { GlobalRoleEnum } from "../enums/global-role.enum";

interface IUser extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: GlobalRoleEnum;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  emailVerifyToken?: string;
  emailVerifyExpire?: Date;
}

interface IMethods {
  comparePassword: (password: string) => Promise<boolean>;
  getResetPasswordToken: () => string;
  getEmailVerifyToken: () => string;
}

const UserSchema = new Schema<IUser, Model<IUser, IMethods>>(
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
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerifyToken: String,
    emailVerifyExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Updating user password if changed before saving to database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  this.password = await bcrypt.hash(this.password, 10);
});

// Comparing Password coming from Frontend
UserSchema.method("comparePassword", function (password: string) {
  return bcrypt.compare(password, this.password);
});

// Generating Password Reset Token
UserSchema.method("getResetPasswordToken", function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
  return resetToken;
});
//generating email verification token
UserSchema.method("getEmailVerifyToken", function () {
  const emailToken = crypto.randomBytes(32).toString("hex");
  this.emailVerifyExpire = new Date(Date.now() + 15 * 60 * 1000);
  return emailToken;
});

const User = model<IUser, Model<IUser, IMethods>>("User", UserSchema);

export default User;
