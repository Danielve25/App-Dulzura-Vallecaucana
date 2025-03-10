import { date, z } from "zod";

export const createTaskSchema = z.object({
  date: z.string().datetime().optional(),
});
