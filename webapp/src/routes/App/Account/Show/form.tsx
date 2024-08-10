import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Currency } from "dinero.js";
import validateCurrencyCode from "validate-currency-code";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isEmpty, isEqual, isNil } from "lodash";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { Form as RouterForm } from "react-router-dom";
import { CalendarIcon, CheckIcon, InfoIcon } from "lucide-react";
import { format } from "date-fns";
import { CaretSortIcon } from "@radix-ui/react-icons";
import moment from "moment";

import Detailed, { Icon, Kind } from "@/types/Account";
import { Currency as ApiCurrency } from "@/types/currency";

import { updateAccount } from "@api/accounts";
import { getCurrencies } from "@api/currencies";
import { staleTimeDefault } from "@queries/Client";

import kindToHuman from "@helpers/account/kindToHuman";
import isExternalAccount from "@helpers/account/isExternalAccount";
import isDebtAccount, { isCreditAccount } from "@helpers/account/isDebtAccount";
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
    CardFooter,
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
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { useToast } from "@components/ui/use-toast";
import currencyAmountToHuman from "@helpers/currencyAmountToHuman";
import currencyAmountColor from "@helpers/currencyAmountColor";

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
        Number,
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
            Number,
            z.number({ required_error: "is required", invalid_type_error: "must be a number" })
        ).optional(),
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
            Number,
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
                Number,
                z.number({ required_error: "is required", invalid_type_error: "must be a number" })
            ).optional(),
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
        delete: z.boolean({
            required_error: "is required",
            invalid_type_error: "must be a boolean"
        }),
    }).array().optional()
})

function mapAccountToUpdateForm(account: Detailed): z.infer<typeof schema> {
    return {
        id: account.id,
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
}

export function UpdateAccountForm({
    account, loading, className
}: { account: Detailed, loading: boolean, className?: string }) {
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const { data: currencies, isError, error } = useQuery({
        queryKey: ["currencies"],
        queryFn: getCurrencies,
        staleTime: staleTimeDefault
    })

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: mapAccountToUpdateForm(account)
    })

    const onSubmitUpdate = async (values: z.infer<typeof schema>) => {
        try {
            const updated = await updateAccount(values.id, {
                ...values,
                history: {
                    ...values.history,
                    at: values.history?.at?.toISOString()
                },
                children: values.children?.map((child) => {
                    return {
                        ...child,
                        history: {
                            ...child.history,
                            at: child.history?.at?.toISOString()
                        }
                    }
                }) || []
            })

            await queryClient.invalidateQueries({
                predicate: ({ queryKey }) => {
                    return isEqual(queryKey, ["accounts", "account", account.id]) ||
                        isEqual(queryKey, ["transactions", "pending", "account", account.id]) ||
                        isEqual(queryKey, ["transactions", "upcoming", "account", account.id])
                }
            })

            toast({
                title: "Saved",
                description: `${updated.name} has been updated`
            })
        } catch (e) {
            console.error(e)

            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "There was a problem with the API"
            })
        }
    }

    const [currency, setCurrency] = useState(account.currency)
    const [color, setColor] = useState(account.color)

    useEffect(() => {
        if (!isEmpty(form.formState.errors)) console.error("errors:", form.formState.errors)
    }, [form.formState.errors])

    useEffect(() => form.reset(mapAccountToUpdateForm(account)), [account.updatedAt])

    if (isError) throw error

    return <div className={cn("flex flex-col gap-4", className)}>
        {
            account.archivedAt && (
                <Alert>
                    <InfoIcon className="h-5 w-5" />
                    <AlertTitle>This account is archived</AlertTitle>
                    <AlertDescription>
                        This means that its transaction history continues to appear in the application. But it will not show in lists to create new transactions, affect your debt levels or available credit.
                    </AlertDescription>
                </Alert>
            )
        }
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmitUpdate)}
                className="flex flex-col gap-4"
            >
                <Details
                    form={form}
                    loading={loading}
                    account={account}
                    currencies={currencies}
                    setCurrency={setCurrency}
                    setColor={setColor}
                />
                {isDebtAccount(account.kind) && (
                    <Capital account={account} currency={currency} form={form} />
                )}
                {!isExternalAccount(account.kind) && (
                    <History form={form} currency={currency} />
                )}
                {isExternalAccount(account.kind) && (
                    <Children account={account} currency={currency} color={color} form={form} />
                )}
                <Card className="p-6">
                    <FormField
                        control={form.control}
                        name="archive"
                        render={({ field }) => (
                            <FormItem
                                className="flex flex-row items-center justify-between space-y-0"
                            >
                                <div>
                                    <FormLabel>
                                        Do you want to archive this child account?
                                    </FormLabel>
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
                </Card>
            </form>
        </Form >
        <div className="flex justify-stretch gap-4">
            <RouterForm
                className="flex grow"
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
    </div>
}

function Details({
    form, loading, account, currencies, setCurrency, setColor
}: {
    form: UseFormReturn<z.infer<typeof schema>>,
    loading: boolean,
    account: Detailed,
    currencies: ApiCurrency[] | undefined,
    setCurrency: Dispatch<SetStateAction<Currency>>,
    setColor: Dispatch<SetStateAction<string>>
}) {
    return <Card>
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
                name="id"
                render={({ field }) => (
                    <input {...field} type="hidden" hidden={true} />
                )}
            />
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
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
                                placeholder="Remind you what this account represents"
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
                                                    value={name}
                                                    key={code}
                                                    onSelect={() => {
                                                        form.setValue("currency", code)
                                                        setCurrency(code)
                                                    }}
                                                    onClick={() => {
                                                        form.setValue("currency", code)
                                                        setCurrency(code)
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
                                {...field}
                                type="color"
                                placeholder={"Color"}
                                onChange={(event) => {
                                    setColor(event.target.value)
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
        <CardFooter className="flex justify-end">
            <Button type="submit">Save</Button>
        </CardFooter>
    </Card>
}

function History({
    form, currency
}: {
    form: UseFormReturn<z.infer<typeof schema>>,
    currency: Currency
}) {
    return <Card>
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
                    <FormItem
                        className="flex flex-row items-center justify-between space-y-0"
                    >
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
                            <div className="flex flex-row gap-4 justify-between items-center">
                                <Input
                                    {...field}
                                    placeholder={"Balance"}
                                    className="flex-1"
                                />
                                <span
                                    className={cn(
                                        "text-lg flex-1 text-right",
                                        currencyAmountColor(field.value ?? 0)
                                    )}
                                >
                                    {currencyAmountToHuman(field.value ?? 0, currency)}
                                </span>
                            </div>
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
        <CardFooter className="flex justify-end">
            <Button type="submit">Save</Button>
        </CardFooter>
    </Card>
}

function Capital({
    account, form, currency
}: {
    account: Detailed,
    form: UseFormReturn<z.infer<typeof schema>>,
    currency: Currency
}) {
    return <Card>
        <CardHeader className="flex flex-row justify-between items-start">
            <div>
                <CardTitle>Capital</CardTitle>
                <CardDescription>
                    {
                        isCreditAccount(account.kind)
                            ? "Represents the credit line's limit"
                            : "Represents the amount of the loan"
                    }
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
            <FormField
                control={form.control}
                name="capital"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Capital</FormLabel>
                        <FormControl>
                            <div className="flex flex-row gap-4 justify-between items-center">
                                <Input
                                    {...field}
                                    placeholder={"Capital"}
                                    className="flex-1"
                                />
                                <span
                                    className={cn(
                                        "text-lg flex-1 text-right",
                                        currencyAmountColor(field.value ?? 0)
                                    )}
                                >
                                    {currencyAmountToHuman(field.value ?? 0, currency)}
                                </span>
                            </div>
                        </FormControl>
                        <FormDescription>
                            A positive value indicates that you owe money. While a negative one indicates that you're owed money.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </CardContent>
    </Card>
}

function Children({
    account, currency, form, color
}: {
    form: UseFormReturn<z.infer<typeof schema>>,
    currency: Currency,
    account: Detailed,
    color: string
}) {
    const { fields: children, append } = useFieldArray({
        name: "children",
        control: form.control,
        keyName: "identity"
    })

    return <Card>
        <CardHeader className="flex flex-row justify-between items-start gap-4 space-y-0">
            <div className="space-y-1.5">
                <CardTitle>Children</CardTitle>
                <CardDescription>Accounts which parent is the current account</CardDescription>
            </div>
            <Button
                type="button"
                onClick={() => {
                    if (confirm(`Do you want to add a new child account to this account? ${account.name}`)) {
                        append({
                            id: undefined,
                            icon: form.getValues("icon"),
                            kind: account.kind,
                            name: "",
                            history: { present: false },
                            color: form.getValues("color"),
                            archive: false,
                            delete: false,
                            capital: 0,
                            currency: currency
                        })
                    }
                }}
                variant="outline"
            >
                Add
            </Button>
        </CardHeader>
        <CardContent className="divide-y-[1px] dark:divide-zinc-800">
            {children.map((child, index) => {
                return <div className="flex flex-col gap-4 py-4" key={child.identity}>
                    <CardTitle>Details</CardTitle>
                    <CardDescription>
                        Information and configuration for a child {kindToHuman(child.kind)} account
                    </CardDescription>
                    <FormField
                        control={form.control}
                        name={`children.${index}.id`}
                        render={({ field }) => (
                            <input {...field} type="hidden" hidden={true} />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`children.${index}.kind`}
                        render={({ field }) => (
                            <input {...field} type="hidden" hidden={true} />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`children.${index}.currency`}
                        render={({ field }) => (
                            <input {...field} value={currency} type="hidden" hidden={true} />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`children.${index}.color`}
                        render={({ field }) => (
                            <input {...field} value={color} type="hidden" hidden={true} />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`children.${index}.name`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
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
                        name={`children.${index}.description`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Remind you what this account represents"
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
                        name={`children.${index}.icon`}
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
                    <FormField
                        control={form.control}
                        name={`children.${index}.archive`}
                        render={({ field }) => (
                            <FormItem
                                className="flex flex-row items-center justify-between space-y-0"
                            >
                                <div>
                                    <FormLabel>
                                        Do you want to archive this child account?
                                    </FormLabel>
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
                        name={`children.${index}.delete`}
                        render={({ field }) => (
                            <FormItem
                                className="flex flex-row items-center justify-between space-y-0"
                            >
                                <div>
                                    <FormLabel>
                                        Do you want to delete this child account?
                                    </FormLabel>
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
                </div>
            })}
        </CardContent>
        <CardFooter className="flex justify-end">
            <Button type="submit">Save</Button>
        </CardFooter>
    </Card>
}
