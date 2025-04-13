import { z } from "zod";

export const menuValidate = z.object({
  Descripcion: z.string({
    required_error: "Descripcion es requerido",
  }),
});
