import z from "zod";

export const markAsAchievedSchema = z.object({ intent: z.literal("mark-as-achieved") })