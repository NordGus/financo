import { z } from "zod";

export const schema = z.object({
  intent: z.literal("destroy")
})
