import { z } from "zod";
import { CURRENCIES } from "~/modules/shared/types/currency";
import { KINDS } from "../types/transactions";

export const schema = z.object({
  issuedAt: z.string().trim().date(),
  executedAt: z.string().trim().date().nullish(),
  notes: z.string().trim().max(256).nullish(),
  currency: z.nativeEnum(CURRENCIES),
  sourceId: z.number().positive().finite(),
  targetId: z.number().positive().finite(),
  sourceAmount: z.number().int().finite(),
  targetAmount: z.number().int().finite(),
  kind: z.nativeEnum(KINDS)
})