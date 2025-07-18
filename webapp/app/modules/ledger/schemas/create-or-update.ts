import z from "zod";
import { CurrenciesForZodEnum } from "~/modules/shared/types/currency";
import { KindsForZodEnum } from "../types/transactions";
import { NOTES_MAX_LENGTH } from "./constants";

export const schema = z.object({
  sourceId: z.number({ error: "Source account is required", })
    .positive({ error: "invalid id" }),
  targetId: z.number({ error: "Target account is required" })
    .positive({ error: "invalid id" }),
  sourceAmount: z.number({ error: "Amount is required" })
    .refine(val => val !== 0, { error: "Amount must be greater than 0" }),
  targetAmount: z.number({ error: "Amount is required" })
    .refine(val => val !== 0, { error: "Amount must be greater than 0" }),
  issuedAt: z.date({ error: "Issued date is required" }),
  executedAt: z.date().nullish(),
  notes: z.string()
    .max(NOTES_MAX_LENGTH, { error: "Notes is too long" })
    .nullish(),
  currency: z.enum(CurrenciesForZodEnum, { error: "invalid option" }),
  kind: z.enum(KindsForZodEnum, { error: "invalid option" }),
  intent: z.union([z.literal("create"), z.literal("update")])
})