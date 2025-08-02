import z from "zod";
import { CurrenciesForZodEnum } from "~/modules/shared/types/currency";

export const reorderActionSchema = z.object({
  id: z.number(),
  from: z.number(),
  to: z.number(),
  currency: z.enum(CurrenciesForZodEnum, { error: "invalid value" }),
  intent: z.literal("reorder")
})