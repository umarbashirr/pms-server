import * as z from "zod";

export const NewPropertyCreationSchema = z.object({
  name: z.string().min(2, {
    message: "Name should be minimum 02 characters",
  }),
  email: z.string().email({
    message: "Invalid email",
  }),
});
