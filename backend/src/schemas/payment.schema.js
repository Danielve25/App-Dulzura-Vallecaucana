import { z } from "zod";

export const numberNequiValidateSchema = z.object({
  phoneNumber: z
    .string({
      required_error: "el numero de telefono es requerido",
    })
    .min(10, {
      message: "el numero de telefono debe tener al menos 10 caracteres",
    }),
  CCnumber: z
    .string({
      required_error: "el numero de cedula es requerido",
    })
    .min(7, {
      message: "el numero de cedula debe tener almenos 7 caracteres",
    }),
  payerName: z
    .string({
      required_error: "el nombre es requerido",
    })
    .min(3, {
      message: "el nombre debe tener almenos 3 caracteres",
    }),
  payAmount: z
    .string({
      required_error: "el monto de dinero es requerido",
    })
    .min(4, {
      message: "el monto de dinero debe tener al menos 4 dígitos",
    }),
});
