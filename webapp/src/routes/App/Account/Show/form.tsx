import { useState } from "react";
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
    FormMessage
} from "@components/ui/form";
import kindToHuman from "@helpers/account/kindToHuman";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Throbber } from "@components/Throbber";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";

const updateSchema = z.object({
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
        .nullable()
        .optional(),
    capital: z.number({
        required_error: "is required",
        invalid_type_error: "must be a number"
    }),
    history: z.object({
        present: z.boolean(
            {
                required_error: "is required",
                invalid_type_error: "must be a boolean"
            }
        ),
        balance: z.number({
            required_error: "is required",
            invalid_type_error: "must be a number"
        }).nullable(),
        at: z.string({
            required_error: "is required",
            invalid_type_error: "must be a string"
        }).datetime({
            message: "must be datetime",
            offset: true
        }).nullable()
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
        id: z.number({ invalid_type_error: "must be a number" }).nullable().optional(),
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
            .nullable()
            .optional(),
        capital: z.number({
            required_error: "is required",
            invalid_type_error: "must be a number"
        }),
        history: z.object({
            present: z.boolean(
                {
                    required_error: "is required",
                    invalid_type_error: "must be a boolean"
                }
            ),
            balance: z.number({
                required_error: "is required",
                invalid_type_error: "must be a number"
            }).nullable(),
            at: z.string({
                required_error: "is required",
                invalid_type_error: "must be a string"
            }).datetime({
                message: "must be datetime",
                offset: true
            }).nullable()
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
        deleted: z.boolean({
            required_error: "is required",
            invalid_type_error: "must be a boolean"
        }),
    }).array().nullable()
})

export function UpdateAccountForm({ account, loading }: { account: Detailed, loading: boolean }) {
    const [detailsChanged, setDetailsChanged] = useState(false)
    const [historyChanged, setHistoryChanged] = useState(false)

    const form = useForm<z.infer<typeof updateSchema>>({
        resolver: zodResolver(updateSchema),
        defaultValues: {
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
                                Information and configuration for a {kindToHuman(account.kind)} account
                            </CardDescription>
                        </div>
                        {loading && <Throbber variant="small" />}
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={"Name"}
                                            onChange={(event) => {
                                                setDetailsChanged(true)
                                                field.onChange(event)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? undefined}
                                            placeholder={"Description"}
                                            onChange={(event) => {
                                                setDetailsChanged(true)
                                                field.onChange(event)
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={"Currency"}
                                            onChange={(event) => {
                                                setDetailsChanged(true)
                                                field.onChange(event)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={"Color"}
                                            onChange={(event) => {
                                                setDetailsChanged(true)
                                                field.onChange(event)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={"Icon"}
                                            onChange={(event) => {
                                                setDetailsChanged(true)
                                                field.onChange(event)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {detailsChanged && <Button type="submit">Save</Button>}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-start">
                        <div>
                            <CardTitle>History</CardTitle>
                            <CardDescription>
                                Represents the account's balance at a given date when you don't the complete transaction history
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="history.present"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value.toString()}
                                            placeholder={"Present"}
                                            onChange={(event) => {
                                                setHistoryChanged(true)
                                                field.onChange(event)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="history.balance"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? 0}
                                            placeholder={"Balance"}
                                            onChange={(event) => {
                                                setHistoryChanged(true)
                                                field.onChange(event)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="history.at"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? undefined}
                                            placeholder={"At"}
                                            onChange={(event) => {
                                                setHistoryChanged(true)
                                                field.onChange(event)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {historyChanged && <Button type="submit">Save</Button>}
                    </CardContent>
                </Card>
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