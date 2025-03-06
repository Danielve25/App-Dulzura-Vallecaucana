import { z } from "zod";

export const registerSchema = z.object({
  NameStudent: z.string({
    required_error: "Name is required",
  }),
  PhoneNumber: z
    .string({
      required_error: "Phone number is required",
    })
    .min(6, {
      message: "Phone Number must be at least 6 characters",
    }),
});

export const loginSchema = z.object({
  PhoneNumber: z
    .string({
      required_error: "Phone number is required",
    })
    .min(6, {
      message: "Phone Number must be at least 6 characters",
    }),
  NameStudent: z.string({
    required_error: "Name is required",
  }),
});
