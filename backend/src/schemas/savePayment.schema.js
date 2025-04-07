import { z } from "zod";

export const SaveTransaccionSchema = z.object({
  orderId: z.string({ required_error: "orderId es requerido" }),
  status: z.string({ required_error: "status es requerido" }),
});
