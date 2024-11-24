import { z } from "zod";

export const zodErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.message) return { message: issue.message.toLocaleLowerCase() }
  else return { message: ctx.defaultError.toLocaleLowerCase() }
}