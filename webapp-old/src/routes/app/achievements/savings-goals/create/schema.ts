import { Currency } from "dinero.js";
import { isNil } from "lodash";
import validateCurrencyCode from "validate-currency-code";
import { z } from "zod";

export const schema = z.object({
    name: z.string({
        required_error: "is required",
        invalid_type_error: "must be a string"
    }).trim()
        .min(1, { message: 'must be present' })
        .max(60, { message: 'must be 60 characters at most' }),
    description: z.string()
        .trim()
        .max(128, { message: "must be 128 characters at most" })
        .optional(),
    currency: z.custom<Currency>(
        (value) => validateCurrencyCode(value),
        { message: "must be an ISO 4217 currency code" }
    ),
    target: z.preprocess(
        (arg) => isNil(arg) ? 0 : Number(arg),
        z.number({ required_error: "is required", invalid_type_error: "must be a number" })
            .nonnegative({ message: "saving debt is a bad idea" })
    )
})