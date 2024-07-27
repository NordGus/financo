import { Currency } from "dinero.js";
import validateCurrencyCode from "validate-currency-code";
import { z } from "zod";

import { Icon, Kind } from "@/types/Account";

export const formSchema = z.object({
    kind: z.enum(
        [
            Kind.CapitalNormal,
            Kind.CapitalSavings,
            Kind.DebtLoan,
            Kind.DebtPersonal,
            Kind.DebtCredit,
            Kind.ExternalIncome,
            Kind.ExternalExpense
        ],
        {
            required_error: "Kind is required",
            invalid_type_error: "Kind must be a string",
            message: "Kind is not valid"
        }
    ),
    currency: z.custom<Currency>(
        (value) => validateCurrencyCode(value),
        (value) => { return { message: `${value} isn't ISO 4217 currency code` } }
    ),
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string"
    }).trim()
        .min(1, { message: 'Name must be present' })
        .max(60, { message: 'Name must be 60 characters at most' }),
    description: z.string()
        .trim()
        .max(128, { message: "Description must be 128 characters at most" })
        .nullable(),
    capital: z.number({
        required_error: "Capital is required",
        invalid_type_error: "Name must be a number"
    }),
    color: z.string({
        required_error: "Color is required",
        invalid_type_error: "Color must be a string"
    }).refine(
        (color) => {
            const validator = new Option().style;
            validator.color = color

            return validator.color.length > 0
        },
        (color) => { return { message: `${color} is not a valid color code` } }
    ),
    archive: z.boolean({
        required_error: "Archive is required",
        invalid_type_error: "Archive must be a boolean"
    }),
    history: z.object({
        present: z.boolean(
            {
                required_error: "Present is required",
                invalid_type_error: "Present must be a boolean"
            }
        ),
        balance: z.number({
            required_error: "Balance is required",
            invalid_type_error: "Balance must be a number"
        }).nullable(),
        at: z.string({
            required_error: "At is required",
            invalid_type_error: "At must be a string"
        }).datetime({
            message: "At must be datetime",
            offset: true
        }).nullable()
    }),
    icon: z.nativeEnum(Icon,
        {
            required_error: "Icon is required",
            invalid_type_error: "Icon is invalid",
            message: "Icon is not supported"
        }
    ),
    children: z.object({
        id: z.number({ invalid_type_error: "ID must be a number" }).nullable(),
        kind: z.enum(
            [
                Kind.CapitalNormal,
                Kind.CapitalSavings,
                Kind.DebtLoan,
                Kind.DebtPersonal,
                Kind.DebtCredit,
                Kind.ExternalIncome,
                Kind.ExternalExpense
            ],
            {
                required_error: "Kind is required",
                invalid_type_error: "Kind must be a string",
                message: "Kind is not valid"
            }
        ),
        currency: z.custom<Currency>(
            (value) => validateCurrencyCode(value),
            (value) => { return { message: `${value} isn't ISO 4217 currency code` } }
        ),
        name: z.string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string"
        }).trim()
            .min(1, { message: 'Name must be present' })
            .max(60, { message: 'Name must be 60 characters at most' }),
        description: z.string()
            .trim()
            .max(128, { message: "Description must be 128 characters at most" })
            .nullable(),
        capital: z.number({
            required_error: "Capital is required",
            invalid_type_error: "Name must be a number"
        }),
        color: z.string({
            required_error: "Color is required",
            invalid_type_error: "Color must be a string"
        }).refine(
            (color) => {
                const validator = new Option().style;
                validator.color = color

                return validator.color.length > 0
            },
            (color) => { return { message: `${color} is not a valid color code` } }
        ),
        archive: z.boolean({
            required_error: "Archive is required",
            invalid_type_error: "Archive must be a boolean"
        }),
        history: z.object({
            present: z.boolean(
                {
                    required_error: "Present is required",
                    invalid_type_error: "Present must be a boolean"
                }
            ),
            balance: z.number({
                required_error: "Balance is required",
                invalid_type_error: "Balance must be a number"
            }).nullable(),
            at: z.string({
                required_error: "At is required",
                invalid_type_error: "At must be a string"
            }).datetime({
                message: "At must be datetime",
                offset: true
            }).nullable()
        }),
        icon: z.nativeEnum(Icon,
            {
                required_error: "Icon is required",
                invalid_type_error: "Icon is invalid",
                message: "Icon is not supported"
            }
        ),
    }).array().nullable()
})
