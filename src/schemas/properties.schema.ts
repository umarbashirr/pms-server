import * as z from "zod";

export const NewPropertyCreationSchema = z.object({
  name: z.string().min(2, {
    message: "Name should be minimum 02 characters",
  }),
  email: z.string().email({
    message: "Invalid email",
  }),
});

export const propertyZodSchema = z.object({
  name: z
    .string()
    .min(1, "Property name is required")
    .trim()
    .transform((val) => val.toLowerCase()),
  email: z
    .string()
    .email("Invalid email format")
    .trim()
    .transform((val) => val.toLowerCase()),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9]{10,15}$/.test(val),
      "Phone number must be 10-15 digits"
    ),
  websiteURL: z.string().optional(),
  mapURL: z.string().optional(),
  latitude: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^-?\d+(\.\d+)?$/.test(val),
      "Latitude must be a valid number"
    ),
  longitude: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^-?\d+(\.\d+)?$/.test(val),
      "Longitude must be a valid number"
    ),
  address: z
    .object({
      locality: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      pincode: z
        .string()
        .optional()
        .refine(
          (val) => !val || /^[0-9]{5,10}$/.test(val),
          "Pincode must be 5-10 digits"
        ),
    })
    .optional(),
  checkInTime: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^([01]\d|2[0-3]):([0-5]\d)$/.test(val),
      "Check-in time must be in HH:mm format"
    ),
  checkOutTime: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^([01]\d|2[0-3]):([0-5]\d)$/.test(val),
      "Checkout time must be in HH:mm format"
    ),
  amenities: z.array(z.string()).optional(),
  description: z.string().optional(),
  policies: z.array(z.string()).default([]),
  images: z.array(z.string().url("Each image URL must be valid")).default([]),
});
