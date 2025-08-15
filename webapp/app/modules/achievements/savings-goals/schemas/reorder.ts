import z from "zod";

export const reorderActionSchema = z.object({
  id: z.number(),
  from: z.number(),
  to: z.number(),
  intent: z.literal("reorder")
})