import * as z from "zod";
import { GlobalRoleEnum } from "../enums/global-role.enum";
import { PropertyRoleEnum } from "../enums/user-role.enum";

export const RegisterSchema = z.object({
  name: z.string().min(2, {
    message: "Name should be minimum 02 characters",
  }),
  email: z.string().email({
    message: "Invalid email",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number should be 10 digits minimum",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password should be minimum 08 characters!",
    })
    .max(30, {
      message: "Password should be maximum 30 characters!",
    }),
});

export const RegisterToPropertySchema = z.object({
  name: z.string().min(2, {
    message: "Name should be minimum 02 characters",
  }),
  email: z.string().email({
    message: "Invalid email",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number should be 10 digits minimum",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password should be minimum 08 characters!",
    })
    .max(30, {
      message: "Password should be maximum 30 characters!",
    }),
  role: z.enum([
    PropertyRoleEnum.RECEPTION,
    PropertyRoleEnum.RESERVATION,
    PropertyRoleEnum.HOUSEKEEPING,
    PropertyRoleEnum.HOTEL_MANAGER,
    PropertyRoleEnum.FB,
    PropertyRoleEnum.ADMIN,
    PropertyRoleEnum.ACCOUNTS,
  ]),
});

export const TeamRegisterSchema = z.object({
  name: z.string().min(2, {
    message: "Name should be minimum 02 characters",
  }),
  email: z.string().email({
    message: "Invalid email",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number should be 10 digits minimum",
  }),
  role: z
    .enum([
      GlobalRoleEnum.BOT,
      GlobalRoleEnum.REGULAR_USER,
      GlobalRoleEnum.SUPER_ADMIN,
      GlobalRoleEnum.SUPPORT_STAFF,
    ])
    .default(GlobalRoleEnum.REGULAR_USER),
  password: z
    .string()
    .min(8, {
      message: "Password should be minimum 08 characters!",
    })
    .max(30, {
      message: "Password should be maximum 30 characters!",
    }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password should be minimum 08 characters!",
    })
    .max(30, {
      message: "Password should be maximum 30 characters!",
    }),
});
