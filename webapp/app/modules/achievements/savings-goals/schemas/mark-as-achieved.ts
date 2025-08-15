import z from "zod";

export const markAsAchievedSchema = z.object({
  achievedAt: z.iso.date({ error: "invalid" }),
  intent: z.literal("mark-as-achieved")
})