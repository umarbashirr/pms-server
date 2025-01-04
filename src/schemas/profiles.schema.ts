import * as z from "zod";

export const individualProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .trim(),
  dateOfBirth: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "Invalid date format for date of birth"
    ),
  isSuspended: z.boolean().default(false),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      postalCode: z.string().optional(),
    })
    .optional(),
  verificationDetails: z
    .object({
      idType: z.string().optional(),
      placeOfIssue: z.string().optional(),
      issuedBy: z.string().optional(),
      dateOfIssue: z
        .string()
        .optional()
        .refine(
          (val) => !val || !isNaN(Date.parse(val)),
          "Invalid date format for date of issue"
        ),
      dateOfExpiry: z
        .string()
        .optional()
        .refine(
          (val) => !val || !isNaN(Date.parse(val)),
          "Invalid date format for date of expiry"
        ),
    })
    .optional(),
  preferences: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const companyProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required").trim(),
  companyCode: z
    .string()
    .min(1, "Company code is required")
    .trim()
    .toUpperCase(),
  contactEmail: z.string().email("Invalid email address").trim().toLowerCase(),
  contactPhone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .trim(),
  isSuspended: z.boolean().default(false),
  gstDetails: z
    .object({
      beneficiaryName: z.string().optional(),
      gstin: z.string().optional(),
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
    })
    .optional(),
  contactPerson: z
    .object({
      name: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email("Invalid email address").optional(),
    })
    .optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      postalCode: z.string().optional(),
    })
    .optional(),
  notes: z.string().optional(),
});
