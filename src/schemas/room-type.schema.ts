import * as z from "zod";

export const RoomTypeSchema = z.object({
  name: z
    .string()
    .min(1, "Room type name is required")
    .trim()
    .transform((val) => val.toLowerCase()),
  code: z
    .string()
    .min(1, "Room type code is required")
    .trim()
    .transform((val) => val.toUpperCase()),
  basePrice: z.number().min(0, "Base price must be at least 0").default(0),
  maxOccupancy: z.number().min(1, "Max occupancy must be at least 1"),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string().url("Each image must be a valid URL")).optional(),
  policies: z.array(z.string()).optional(),
});
