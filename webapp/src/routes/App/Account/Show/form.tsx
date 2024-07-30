import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Currency } from "dinero.js";
import validateCurrencyCode from "validate-currency-code";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isEmpty, isNil } from "lodash";
import { useForm } from "react-hook-form";
import { Form as RouterForm } from "react-router-dom";
import { CalendarIcon, CheckIcon } from "lucide-react";
import { format } from "date-fns";
import { CaretSortIcon } from "@radix-ui/react-icons";
import moment from "moment";

import Detailed, { Icon, Kind } from "@/types/Account";

import { getCurrencies } from "@api/currencies";
import { staleTimeDefault } from "@queries/Client";

import kindToHuman from "@helpers/account/kindToHuman";
import { cn } from "@/lib/utils";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@components/ui/card";
import { Throbber } from "@components/Throbber";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { Calendar } from "@components/ui/calendar";
import { Switch } from "@components/ui/switch";
import { Textarea } from "@components/ui/textarea";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@components/ui/command";
import isExternalAccount from "@helpers/account/isExternalAccount";

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
        .optional()
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
        }).optional(),
        at: z.date({
            required_error: "is required",
            invalid_type_error: "must be a date"
        }).optional()
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
        id: z.number({ invalid_type_error: "must be a number" }).optional().optional(),
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
            }).optional(),
            at: z.date({
                required_error: "is required",
                invalid_type_error: "must be a date"
            }).optional()
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
    }).array().optional()
})

function onSubmitUpdate(values: z.infer<typeof updateSchema>) {
    console.log("it saved")
    console.log(values)
}

export function UpdateAccountForm({ account, loading }: { account: Detailed, loading: boolean }) {
    const { data: currencies, isError, error } = useQuery({
        queryKey: ["currencies"],
        queryFn: getCurrencies,
        staleTime: staleTimeDefault
    })
    const form = useForm<z.infer<typeof updateSchema>>({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            kind: account.kind,
            currency: account.currency,
            name: account.name,
            description: account.description ?? undefined,
            capital: account.capital,
            history: {
                present: !isNil(account.history),
                balance: isNil(account.history?.balance) ? undefined : account.history.balance,
                at: isNil(account.history?.at) ? undefined : moment(account.history.at).toDate()
            },
            color: account.color,
            icon: account.icon,
            archive: !isNil(account.archivedAt),
            children: isNil(account.children) ? undefined : account.children.map(
                (child) => {
                    return {
                        id: child.id ?? undefined,
                        kind: child.kind,
                        currency: child.currency,
                        name: child.name,
                        description: child.description ?? undefined,
                        capital: child.capital,
                        history: {
                            present: !isNil(child.history),
                            balance: isNil(child.history?.balance)
                                ? undefined
                                : child.history.balance,
                            at: isNil(child.history?.at)
                                ? undefined
                                : moment(child.history.at).toDate()
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

    useEffect(() => {
        if (!isEmpty(form.formState.errors)) console.log("errors:", form.formState.errors)
    }, [form.formState.errors])

    if (isError) throw error

    return <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitUpdate)} className="flex flex-col gap-4">
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
                    <CardContent className="flex flex-col gap-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="hidden">
                                    <FormControl>
                                        <Input
                                            type="hidden"
                                            {...field}
                                            placeholder={"Name"}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormLabel>Name</FormLabel>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={"Name"}
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
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit about yourself"
                                            className="resize-none"
                                            rows={5}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Currency</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild={true}>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value && "text-zin-500"
                                                    )}
                                                >
                                                    {
                                                        field.value
                                                            ? currencies?.find(
                                                                ({ code }) => code === field.value
                                                            )?.name
                                                            : "Select Currency"
                                                    }
                                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search currency..."
                                                    className="h-9"
                                                />
                                                <CommandList>
                                                    <CommandEmpty>No Currency found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {currencies?.map(({ code, name }) => (
                                                            <CommandItem
                                                                value={code}
                                                                key={name}
                                                                onSelect={() => {
                                                                    form.setValue("currency", code)
                                                                }}
                                                                onClick={() => {
                                                                    form.setValue("currency", code)
                                                                }}
                                                            >
                                                                {name}
                                                                <CheckIcon
                                                                    className={cn(
                                                                        "ml-auto h-4 w-4",
                                                                        code === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        This is the currency your account operates with
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="color"
                                            {...field}
                                            placeholder={"Color"}
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
                                    <FormLabel>Icon</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={"Icon"}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                <div className="flex justify-end sticky top-0">
                    <Button type="submit">Save</Button>
                </div>
                {!isExternalAccount(account.kind) && (
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-start">
                            <div>
                                <CardTitle>History</CardTitle>
                                <CardDescription>
                                    Represents the account's balance at a given date when you don't the complete transaction history
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="history.present"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between">
                                        <div>
                                            <FormLabel>Does this account has history</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="history.balance"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Balance</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                value={field.value ?? 0}
                                                placeholder={"Balance"}
                                            />
                                        </FormControl>
                                        <FormDescription>Transaction's amount</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="history.at"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>At</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>Transaction's date</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                )}
            </form>
        </Form >
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
    </>
}