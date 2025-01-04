import * as z from "zod";

export const roomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required").trim(),
  roomTypeRef: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid RoomType ID format"), // Ensures it's a valid ObjectId
  isAvailable: z.boolean().default(true),
  floor: z.number().optional(),
});
