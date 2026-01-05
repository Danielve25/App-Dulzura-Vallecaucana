import { z } from "zod";

export const registerSchema = z
  .object({
    NameStudent: z.string({
      required_error: "nombre es requerido",
    }),
    PhoneNumber: z
      .string({
        required_error: "numero de telefono es requerido",
      })
      .min(6, {
        message: "el numero de telefono debe tener almenos 6 caracteres",
      }),
    grade: z.string({
      required_error: "grado es requerido",
    }),
  })
  .strict();

export const loginSchema = z.object({
  PhoneNumber: z
    .string({
      required_error: "numero de telefono es requerido",
    })
    .min(6, {
      message: "el numero de telefono debe tener almenos 6 caracteres",
    }),
  NameStudent: z.string({
    required_error: "nombre es requerido",
  }),
});
