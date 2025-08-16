import z from "zod";

export const destroySchema = z.object({ intent: z.literal("destroy") })