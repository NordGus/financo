import z from "zod";
import { CurrenciesForZodEnum } from "~/modules/shared/types/currency";

export const savingsGoalSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullish(),
  position: z.number(),
  target: z.number(),
  saved: z.number(),
  currency: z.enum(CurrenciesForZodEnum, { error: "invalid value" }),
  updatedAt: z.iso.datetime(),
  createdAt: z.iso.datetime()
})

export const savingsGoalsGroupSchema = z.object({
  currency: z.enum(CurrenciesForZodEnum, { error: "invalid value" }),
  goals: savingsGoalSchema.array()
})