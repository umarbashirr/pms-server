import * as z from "zod";

export const MealPlanFormSchema = z.object({
  name: z
    .string()
    .min(1, "name is required")
    .trim()
    .transform((val) => val.toLowerCase()),
  code: z
    .string()
    .min(1, "code is required")
    .trim()
    .transform((val) => val.toUpperCase()),
  price: z.coerce.number().min(0, "Base price must be at least 0").default(0),
  description: z.string().optional(),
});
