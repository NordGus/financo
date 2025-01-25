import { Icon, Kind } from "@/types/Account";
import { normalizeDateForServer } from "@helpers/normalizeDate";
import { Currency } from "dinero.js";
import { isNil } from "lodash";
import moment from "moment";
import validateCurrencyCode from "validate-currency-code";
import { z } from "zod";

const schema = z.object({
    id: z.number({ required_error: "is required", invalid_type_error: "must be a number" }),
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
    history: z.object({
        present: z.boolean(
            {
                required_error: "is required",
                invalid_type_error: "must be a boolean"
            }
        ),
        balance: z.preprocess(
            (arg) => isNil(arg) ? 0 : Number(arg),
            z.number({ required_error: "is required", invalid_type_error: "must be a number" })
        ).optional(),
        at: z.preprocess(
            (arg) => isNil(arg) ? arg : normalizeDateForServer(moment(arg as Date).toDate()),
            z.date({
                required_error: "is required",
                invalid_type_error: "must be a date"
            }).optional()
        ).optional()
    }),
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
    archive: z.boolean({
        required_error: "is required",
        invalid_type_error: "must be a boolean"
    }),
    children: z.object({
        id: z.number({ invalid_type_error: "must be a number" }).optional(),
        kind: z.nativeEnum(Kind,
            {
                required_error: "is required",
                invalid_type_error: "must be a string",
                message: "is not valid"
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
        history: z.object({
            present: z.boolean(
                {
                    required_error: "is required",
                    invalid_type_error: "must be a boolean"
                }
            ),
            balance: z.preprocess(
                (arg) => isNil(arg) ? 0 : Number(arg),
                z.number({ required_error: "is required", invalid_type_error: "must be a number" })
            ).optional(),
            at: z.preprocess(
                (arg) => isNil(arg) ? arg : normalizeDateForServer(moment(arg as Date).toDate()),
                z.date({
                    required_error: "is required",
                    invalid_type_error: "must be a date"
                }).optional()
            ).optional()
        }),
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
        archive: z.boolean({
            required_error: "is required",
            invalid_type_error: "must be a boolean"
        }),
        delete: z.boolean({
            required_error: "is required",
            invalid_type_error: "must be a boolean"
        }),
    }).array().optional()
})

export { schema };
