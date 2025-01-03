import * as z from "zod";

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
