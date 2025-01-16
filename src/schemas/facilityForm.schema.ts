import * as z from "zod";

export const FacilityFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Facility name should be minimum 02 characters!" }),
  isPublished: z.boolean().default(true),
});
