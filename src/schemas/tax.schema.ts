import * as z from "zod";

export const TaxFormSchema = z.object({
  name: z.string().min(1, "Tax name is required").trim(),
  percentage: z.coerce
    .number()
    .min(0, "Tax percentage must be at least 0")
    .max(100, "Tax percentage cannot exceed 100"),
  applicableCategories: z
    .array(z.enum(["Room", "Meal Plan", "Other"]))
    .nonempty("At least one applicable category is required"),
});
