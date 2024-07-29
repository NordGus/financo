import { Currency } from "dinero.js";
import validateCurrencyCode from "validate-currency-code";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isNil } from "lodash";
import { useForm } from "react-hook-form";
import { Form as RouterForm } from "react-router-dom";

import Detailed, { Icon, Kind } from "@/types/Account";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Throbber } from "@components/Throbber";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";

const updateSchema = z.object({
    kind: z.nativeEnum(Kind,
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
    icon: z.nativeEnum(Icon,
        {
            required_error: "Icon is required",
            invalid_type_error: "Icon is invalid",
            message: "Icon is not supported"
        }
    ),
    archive: z.boolean({
        required_error: "Archive is required",
        invalid_type_error: "Archive must be a boolean"
    }),
    children: z.object({
        id: z.number({ invalid_type_error: "ID must be a number" }).nullable().optional(),
        kind: z.nativeEnum(Kind,
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
        icon: z.nativeEnum(Icon,
            {
                required_error: "Icon is required",
                invalid_type_error: "Icon is invalid",
                message: "Icon is not supported"
            }
        ),
        archive: z.boolean({
            required_error: "Archive is required",
            invalid_type_error: "Archive must be a boolean"
        }),
        deleted: z.boolean({
            required_error: "is required",
            invalid_type_error: "must be a boolean"
        }),
    }).array().nullable()
})

export function UpdateAccountForm({ account, loading }: { account: Detailed, loading: boolean }) {
    const form = useForm<z.infer<typeof updateSchema>>({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            kind: account.kind,
            currency: account.currency,
            name: account.name,
            description: account.description,
            capital: account.capital,
            history: {
                present: !isNil(account.history),
                balance: isNil(account.history?.balance) ? null : account.history.balance,
                at: isNil(account.history?.at) ? null : account.history.at
            },
            color: account.color,
            icon: account.icon,
            archive: !isNil(account.archivedAt),
            children: isNil(account.children) ? null : account.children.map(
                (child) => {
                    return {
                        id: child.id,
                        kind: child.kind,
                        currency: child.currency,
                        name: child.name,
                        description: child.description,
                        capital: child.capital,
                        history: {
                            present: !isNil(child.history),
                            balance: isNil(child.history?.balance) ? null : child.history.balance,
                            at: isNil(child.history?.at) ? null : child.history.at
                        },
                        color: child.color,
                        icon: child.icon,
                        archive: !isNil(child.archivedAt),
                        delete: false
                    }
                }
            )
        }
    })

    const onSubmit = (values: z.infer<typeof updateSchema>) => {
        console.log(values)
    }

    return <div className="flex flex-col gap-4">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <Card>
                    <CardHeader className="flex flex-row justify-between items-start">
                        <div>
                            <CardTitle>Details</CardTitle>
                            <CardDescription>
                                Account information and configuration
                            </CardDescription>
                        </div>
                        {loading && <Throbber variant="small" />}
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                <Button type="submit">Save</Button>
            </form>
        </Form>
        <RouterForm
            className="flex"
            method="delete"
            onSubmit={(event) => {
                if (!confirm(`Do you want to delete this account? (${account.name})`)) {
                    event.preventDefault()
                }
            }}
        >
            <Button type="submit" variant="destructive" className="grow">
                Delete
            </Button>
        </RouterForm>
    </div>
}