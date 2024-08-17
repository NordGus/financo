import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isEmpty, isEqual, isNil } from "lodash";
import { CalendarIcon, CheckIcon, InfoIcon } from "lucide-react";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Form as RouterForm } from "react-router-dom";

import Transaction, { Account, Create, Update } from "@/types/Transaction";
import { Kind, Select } from "@/types/Account";

import { getSelectableAccounts } from "@api/accounts";
import { createTransaction, updateTransaction } from "@api/transactions";
import { staleTimeDefault } from "@queries/Client";

import currencyAmountToHuman from "@helpers/currencyAmountToHuman";
import kindToHuman from "@helpers/account/kindToHuman";
import { accountContrastColor } from "@helpers/account/accountContrastColor";
import { cn } from "@/lib/utils";

import { Button } from "@components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@components/ui/command";
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
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@components/ui/popover";
import { useToast } from "@components/ui/use-toast";
import { Input } from "@components/ui/input";
import { Calendar } from "@components/ui/calendar";
import { Textarea } from "@components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";

const schema = z.object({
    id: z.number({ invalid_type_error: "must be a number" }).optional(),
    sourceID: z.number({ required_error: "is required", invalid_type_error: "must be a number" }),
    targetID: z.number({ required_error: "is required", invalid_type_error: "must be a number" }),
    issuedAt: z.date({ required_error: "is required", invalid_type_error: "must be a date" }),
    executedAt: z.date({ invalid_type_error: "must be a date" }).optional(),
    sourceAmount: z.preprocess(
        (arg) => isNil(arg) ? 0 : Number(arg),
        z.number({ required_error: "is required", invalid_type_error: "must be a number" })
    ),
    targetAmount: z.preprocess(
        (arg) => isNil(arg) ? 0 : Number(arg),
        z.number({ required_error: "is required", invalid_type_error: "must be a number" })
    ),
    notes: z.string({ invalid_type_error: "must be a string" })
        .trim()
        .max(128, { message: "must be 128 characters at most" })
        .optional()
})

function mapTransactionToForm(transaction: Transaction | {}): z.infer<typeof schema> | {} {
    if (isEqual(transaction, {})) return {}
    const {
        id,
        source: { id: sourceID },
        target: { id: targetID },
        notes,
        issuedAt,
        executedAt,
        sourceAmount,
        targetAmount
    } = transaction as Transaction

    return {
        id,
        sourceID,
        targetID,
        notes: notes ? notes : undefined,
        issuedAt: moment(issuedAt).toDate(),
        executedAt: executedAt ? moment(executedAt).toDate() : undefined,
        sourceAmount,
        targetAmount
    } as z.infer<typeof schema>
}

function mapAccountToSelect(account: Account): Select {
    return {
        id: account.id,
        name: account.parent ? `${account.parent.name} (${account.name})` : account.name,
        currency: account.currency,
        kind: account.kind,
        color: account.color,
        icon: account.icon,
        archivedAt: account.archivedAt,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt
    }
}

function anyAccountIsArchived(transaction: Transaction | {}): boolean {
    if (isEqual(transaction, {})) return false

    return !isNil((transaction as Transaction).target.archivedAt) ||
        !isNil((transaction as Transaction).source.archivedAt)
}

function isHistoryTransaction(transaction: Transaction | {}): boolean {
    if (isEqual(transaction, {})) return false

    return (transaction as Transaction).target.kind === Kind.SystemHistoric ||
        (transaction as Transaction).source.kind === Kind.SystemHistoric
}

function issuedAtDefault(transaction: Transaction | {}): Date {
    if (isEqual(transaction, {})) return moment().toDate()

    return moment((transaction as Transaction).issuedAt).toDate()
}

function executedAtDefault(transaction: Transaction | {}): Date | undefined {
    if (isEqual(transaction, {})) return undefined
    if (!(transaction as Transaction).executedAt) return undefined

    return moment((transaction as Transaction).executedAt!).toDate()
}

interface Props {
    transaction: Transaction | {}
    setOpen: Dispatch<SetStateAction<boolean>>
}

export default function TransactionForm({ transaction, setOpen }: Props) {
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: mapTransactionToForm(transaction)
    })
    const [source, setSource] = useState<Select | undefined>()
    const [target, setTarget] = useState<Select | undefined>()
    const [sources, setSources] = useState<Select[]>([])
    const [targets, setTargets] = useState<Select[]>([])
    const [issuedAt, setIssuedAt] = useState<Date>(issuedAtDefault(transaction))
    const [executedAt, setExecutedAt] = useState<Date | undefined>(executedAtDefault(transaction))

    const accounts = useQuery({
        queryKey: ["accounts", "select"],
        queryFn: getSelectableAccounts,
        staleTime: staleTimeDefault,
    })

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            const { id, sourceID, targetID, issuedAt, executedAt, sourceAmount, targetAmount, notes } = values

            const tr = !id
                ? await createTransaction({
                    sourceID,
                    targetID,
                    issuedAt: issuedAt.toISOString(),
                    executedAt: executedAt ? executedAt.toISOString() : null,
                    sourceAmount,
                    targetAmount,
                    notes: notes ? notes : null
                } as Create)
                : await updateTransaction(id, {
                    id,
                    sourceID,
                    targetID,
                    issuedAt: issuedAt.toISOString(),
                    executedAt: executedAt ? executedAt.toISOString() : null,
                    sourceAmount,
                    targetAmount,
                    notes: notes ? notes : null
                } as Update);

            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["transactions"] }),
                queryClient.invalidateQueries({ queryKey: ["accounts"] })
            ])

            setOpen(false)
            toast({
                title: "Saved!",
                description: `Transaction between ${tr.source.name} and ${tr.target.name} has been saved`
            })
        } catch (e) {
            console.error(e)

            toast({
                variant: "destructive",
                title: "Oops!",
                description: "Something went wrong with the API"
            })
        }
    }

    if (accounts.isError) throw accounts.error

    useEffect(() => form.setValue("issuedAt", issuedAt), [])

    useEffect(() => {
        if (isNil(accounts.data)) return
        if (isEqual(transaction, {})) return

        setSource(mapAccountToSelect((transaction as Transaction).source))
        setTarget(mapAccountToSelect((transaction as Transaction).target))
    }, [accounts.data])

    useEffect(() => {
        if (isNil(accounts.data)) return
        setSources(
            accounts.data.filter(({ id }) => id !== target?.id).map((account) => {
                if (account.children) {
                    return [
                        account,
                        ...account.children.filter(({ archivedAt }) => !!archivedAt).map((child) => ({
                            ...child, name: `${account.name} (${child.name})`
                        }))
                    ]
                }

                return [account]
            }).flat(1)
        )
    }, [accounts.data, target])

    useEffect(() => {
        if (isNil(accounts.data)) return
        setTargets(
            accounts.data
                .filter(({ id }) => id !== source?.id).map((account) => {
                    if (account.children) {
                        return [
                            account,
                            ...account.children.filter(({ archivedAt }) => !!archivedAt).map((child) => ({
                                ...child, name: `${account.name} (${child.name})`
                            }))
                        ]
                    }

                    return [account]
                }).flat(1)
        )
    }, [accounts.data, source])

    useEffect(() => {
        if (!executedAt) return
        if (issuedAt > executedAt) setExecutedAt(undefined)
    }, [issuedAt])

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="pt-4 flex flex-col gap-4 text-zinc-950 dark:text-zinc-50"
            >
                {
                    anyAccountIsArchived(transaction) && (
                        <Alert>
                            <InfoIcon className="h-5 w-5" />
                            <AlertTitle>One of the accounts in the transaction is archived</AlertTitle>
                            <AlertDescription>
                                If you modify this transaction, you will damage the historic data for the archived account
                            </AlertDescription>
                        </Alert>
                    )
                }
                {
                    isHistoryTransaction(transaction) && (
                        <Alert>
                            <InfoIcon className="h-5 w-5" />
                            <AlertTitle>This is a history transaction</AlertTitle>
                            <AlertDescription>
                                It can't be deleted
                            </AlertDescription>
                        </Alert>
                    )
                }
                <FormField
                    control={form.control}
                    name="sourceID"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>From</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild={true}>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-full justify-between gap-4 font-normal",
                                                !field.value && "text-zin-500"
                                            )}
                                            style={
                                                field.value && source
                                                    ? {
                                                        backgroundColor: source.color,
                                                        color: accountContrastColor(source.color)
                                                    }
                                                    : {}

                                            }
                                        >
                                            <span>
                                                {
                                                    field.value
                                                        ? source?.name
                                                        : "Select source account"
                                                }
                                            </span>
                                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[380px] p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search account..."
                                            className="h-9"
                                        />
                                        <CommandList>
                                            <CommandEmpty>No Account found.</CommandEmpty>
                                            <CommandGroup>
                                                {sources.map((acc) => (
                                                    <CommandItem
                                                        value={acc.name}
                                                        key={acc.id}
                                                        onSelect={() => {
                                                            form.setValue("sourceID", acc.id)
                                                            setSource(acc)
                                                        }}
                                                        onClick={() => {
                                                            form.setValue("sourceID", acc.id)
                                                            setSource(acc)
                                                        }}
                                                        className="flex gap-4"
                                                    >
                                                        <span className="grow">{acc.name}</span>
                                                        <span
                                                            className="px-1 rounded"
                                                            style={{
                                                                backgroundColor: acc.color,
                                                                color:
                                                                    accountContrastColor(acc.color)
                                                            }}
                                                        >
                                                            {kindToHuman(acc.kind)}
                                                        </span>
                                                        <CheckIcon
                                                            className={cn(
                                                                "h-4 w-4",
                                                                acc.id === field.value
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
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="targetID"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>To</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild={true}>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-full justify-between gap-4 font-normal",
                                                !field.value && "text-zin-500"
                                            )}
                                            style={
                                                field.value && target
                                                    ? {
                                                        backgroundColor: target.color,
                                                        color: accountContrastColor(target.color)
                                                    }
                                                    : {}

                                            }
                                        >
                                            <span>
                                                {
                                                    field.value
                                                        ? target?.name
                                                        : "Select target account"
                                                }
                                            </span>
                                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[380px] p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search account..."
                                            className="h-9"
                                        />
                                        <CommandList>
                                            <CommandEmpty>No Account found.</CommandEmpty>
                                            <CommandGroup>
                                                {targets.map((acc) => (
                                                    <CommandItem
                                                        value={acc.name}
                                                        key={acc.id}
                                                        onSelect={() => {
                                                            form.setValue("targetID", acc.id)
                                                            setTarget(acc)
                                                        }}
                                                        onClick={() => {
                                                            form.setValue("targetID", acc.id)
                                                            setTarget(acc)
                                                        }}
                                                        className="flex gap-4"
                                                    >
                                                        <span className="grow">{acc.name}</span>
                                                        <span
                                                            className="px-1 rounded"
                                                            style={{
                                                                backgroundColor: acc.color,
                                                                color:
                                                                    accountContrastColor(acc.color)
                                                            }}
                                                        >
                                                            {kindToHuman(acc.kind)}
                                                        </span>
                                                        <CheckIcon
                                                            className={cn(
                                                                "h-4 w-4",
                                                                acc.id === field.value
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
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="sourceAmount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {
                                    source?.currency === target?.currency
                                        ? "Amount"
                                        : "Source Amount"
                                }
                            </FormLabel>
                            <FormControl>
                                <div className="flex flex-row gap-4 justify-between items-center">
                                    <Input
                                        {...field}
                                        placeholder={
                                            source?.currency === target?.currency
                                                ? "Amount"
                                                : "Source Amount"
                                        }
                                        className="flex-1"
                                        onChange={(event) => {
                                            if (source?.currency === target?.currency) {
                                                form.setValue(
                                                    "targetAmount",
                                                    Number(event.target.value)
                                                )
                                            }

                                            field.onChange(event)
                                        }}
                                    />
                                    <span
                                        className={cn(
                                            "text-lg flex-1 text-right",
                                        )}
                                    >
                                        {
                                            currencyAmountToHuman(
                                                field.value ?? 0, source?.currency || "EUR"
                                            )
                                        }
                                    </span>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {
                    source?.currency !== target?.currency && (
                        <FormField
                            control={form.control}
                            name="targetAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Target Amount</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-row gap-4 justify-between items-center">
                                            <Input
                                                {...field}
                                                placeholder={"Target Amount"}
                                                className="flex-1"
                                            />
                                            <span
                                                className={cn(
                                                    "text-lg flex-1 text-right",
                                                )}
                                            >
                                                {
                                                    currencyAmountToHuman(
                                                        field.value ?? 0, target?.currency || "EUR"
                                                    )
                                                }
                                            </span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )
                }
                <FormField
                    control={form.control}
                    name="issuedAt"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Issued At</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild={true}>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "pl-3 text-left font-normal",
                                                !field.value && "text-zinc-500"
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
                                        onSelect={(date, selectedDay, activeModifiers, e) => {
                                            setIssuedAt(selectedDay)
                                            field.onChange(date, selectedDay, activeModifiers, e)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                Indicates the date that the transaction is executed on the source account
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="executedAt"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Executed At</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild={true}>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "pl-3 text-left font-normal",
                                                !field.value && "text-zinc-500"
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
                                        disabled={(date) => date < moment(issuedAt).startOf('day').toDate()}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                Indicates the date that the transaction is received by the target account
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Any reminder about this transaction"
                                    className="resize-none"
                                    rows={5}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Save</Button>
            </form>
            {
                !isEmpty(transaction) && !isHistoryTransaction(transaction) && (
                    <RouterForm
                        className="flex p-0 mt-4"
                        method="delete"
                        action={`/ledger/${(transaction as Transaction).id}`}
                        onSubmit={(event) => {
                            if (!confirm(`Do you want to delete this transaction?`)) {
                                event.preventDefault()
                            }
                        }}
                    >
                        <Button type="submit" variant="destructive" className="grow">
                            Delete
                        </Button>
                    </RouterForm>
                )
            }
        </Form>
    )
}