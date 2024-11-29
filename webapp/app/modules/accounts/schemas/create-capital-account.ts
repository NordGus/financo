import { z } from "zod";
import { CURRENCIES } from "~/shared/types/currency";

export const schema = z.object({
  name: z.string().trim().min(3).max(128),
  description: z.string().trim().max(256).optional(),
  currency: z.nativeEnum(CURRENCIES),
  history: z.object({
    at: z.date().optional(),
    balance: z.number().optional()
  })
});