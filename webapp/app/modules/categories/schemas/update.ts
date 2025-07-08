import { z } from "zod";
import { ICONS } from "~/modules/shared/types/icon";
import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from "./constants";

export const oldSchema = z.object({
  id: z.number(),
  name: z.string().trim().min(3).max(128),
  description: z.string().trim().max(256).optional(),
  color: z.string().refine((color) => {
    const validator = new Option().style;
    validator.color = color

    return validator.color.length > 0
  }, { message: `must be a valid color code` }),
  icon: z.nativeEnum(ICONS),
})

export const schema = z.object({
  kind: z.union([z.literal("income"), z.literal("expense")]),
  color: z.string({ required_error: "required" })
    .max(10, { message: "invalid" }),
  icon: z.nativeEnum(ICONS, { required_error: "required", message: "invalid option" }),
  name: z.string({ required_error: "required" })
    .max(NAME_MAX_LENGTH, { message: "too long" })
    .min(NAME_MIN_LENGTH, { message: "too short" }),
  description: z.string()
    .max(DESCRIPTION_MAX_LENGTH, { message: "too long" })
    .nullish(),
  subcategories: z.array(z.union([
    z.object({
      id: z.number(),
      icon: z.nativeEnum(ICONS, { required_error: "required", message: "invalid option" }),
      name: z.string({ required_error: "required" })
        .max(NAME_MAX_LENGTH, { message: "too long" })
        .min(NAME_MIN_LENGTH, { message: "too short" }),
      description: z.string()
        .max(DESCRIPTION_MAX_LENGTH, { message: "too long" })
        .nullish(),
      intent: z.union([
        z.literal("update"),
        z.literal("destroy"),
        z.literal("archive"),
        z.literal("unarchive")
      ])
    }),
    z.object({
      id: z.undefined().nullish(),
      icon: z.nativeEnum(ICONS, { required_error: "required", message: "invalid option" }),
      name: z.string({ required_error: "required" })
        .max(NAME_MAX_LENGTH, { message: "too long" })
        .min(NAME_MIN_LENGTH, { message: "too short" }),
      description: z.string()
        .max(DESCRIPTION_MAX_LENGTH, { message: "too long" })
        .nullish(),
      intent: z.literal("create")
    })
  ])),
  intent: z.literal("update")
})