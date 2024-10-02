import { Icon, Kind } from "@/types/Account";
import { Currency } from "dinero.js";
import { isNil } from "lodash";
import validateCurrencyCode from "validate-currency-code";
import { z } from "zod";

const schema = z.object({
    kind: z.nativeEnum(Kind,
        {
            required_error: "is required",
            invalid_type_error: "must be a string",
            message: "invalid"
        }
    ),
    currency: z.custom<Currency>(
        (value) => validateCurrencyCode(value),
        { message: "must be a ISO 4217 currency code" }
    ),
    name: z.string({
        required_error: "is required",
        invalid_type_error: "must be a string"
    }).trim()
        .min(1, { message: 'must be present' })
        .max(60, { message: 'must be 60 characters at most' }),
    description: z.string()
        .trim()
        .max(128, { message: "must be 128 characters at most" })
        .optional()
        .optional(),
    capital: z.preprocess(
        (arg) => isNil(arg) ? 0 : Number(arg),
        z.number({ required_error: "is required", invalid_type_error: "must be a number" })
    ),
    color: z.string({
        required_error: "is required",
        invalid_type_error: "must be a string"
    }).refine(
        (color) => {
            const validator = new Option().style;
            validator.color = color

            return validator.color.length > 0
        },
        { message: `must be a valid color code` }
    ),
    icon: z.nativeEnum(Icon,
        {
            required_error: "is required",
            invalid_type_error: "is invalid",
            message: "not supported"
        }
    ),
})

export { schema };
