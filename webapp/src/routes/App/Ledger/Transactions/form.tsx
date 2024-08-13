import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { isEqual, isNil } from "lodash";
import { CheckIcon } from "lucide-react";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Transaction from "@/types/Transaction";
import { Select } from "@/types/Account";

import { getSelectableAccounts } from "@api/accounts";
import { staleTimeDefault } from "@queries/Client";

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

const schema = z.object({
    id: z.number({ invalid_type_error: "must be a number" }).optional(),
    sourceId: z.number({ required_error: "is required", invalid_type_error: "must be a number" }),
    targetId: z.number({ required_error: "is required", invalid_type_error: "must be a number" }),
    issuedAt: z.date({ required_error: "is required", invalid_type_error: "must be a date" }),
    executedAt: z.date({ invalid_type_error: "must be a date" }).nullable().optional(),
    sourceAmount: z.number({
        required_error: "is required",
        invalid_type_error: "must be a number"
    }),
    targetAmount: z.number({
        required_error: "is required",
        invalid_type_error: "must be a number"
    }),
})

function mapTransactionToForm(transaction: Transaction | {}): z.infer<typeof schema> | {} {
    if (isEqual(transaction, {})) return {}
    const {
        id,
        source: { id: sourceId },
        target: { id: targetId },
        issuedAt,
        executedAt,
        sourceAmount,
        targetAmount
    } = transaction as Transaction

    return {
        id,
        sourceId,
        targetId,
        issuedAt: moment(issuedAt).toDate(),
        executedAt: executedAt ? moment(executedAt).toDate() : undefined,
        sourceAmount,
        targetAmount
    } as z.infer<typeof schema>
}

interface Props {
    transaction: Transaction | {}
    setOpen: Dispatch<SetStateAction<boolean>>
}

export default function TransactionForm({ transaction, setOpen }: Props) {
    const { toast } = useToast()
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: mapTransactionToForm(transaction)
    })
    const [source, setSource] = useState<Select | undefined>()
    const [target, setTarget] = useState<Select | undefined>()
    const [sources, setSources] = useState<Select[]>([])
    const [targets, setTargets] = useState<Select[]>([])

    const accounts = useQuery({
        queryKey: ["accounts", "select"],
        queryFn: getSelectableAccounts,
        staleTime: staleTimeDefault,
    })

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            console.log(values)
            setTarget(undefined)
            setSource(undefined)
            setOpen(false)
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

    useEffect(() => {
        if (isNil(accounts.data)) return
        if (isEqual(transaction, {})) return

        setSource(accounts.data.find(({ id }) => (transaction as Transaction).source.id === id))
        setTarget(accounts.data.find(({ id }) => (transaction as Transaction).target.id === id))
    }, [accounts.data])

    useEffect(() => {
        if (isNil(accounts.data)) return
        setSources(
            accounts.data.filter(({ id }) => id !== target?.id).map((account) => {
                if (account.children) {
                    return [
                        account,
                        ...account.children.map((child) => ({
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
                            ...account.children.map((child) => ({
                                ...child, name: `${account.name} (${child.name})`
                            }))
                        ]
                    }

                    return [account]
                }).flat(1)
        )
    }, [accounts.data, source])

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="pt-4 flex flex-col gap-4 text-zinc-950 dark:text-zinc-50"
            >
                <FormField
                    control={form.control}
                    name="sourceId"
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
                                                "w-full justify-between gap-4",
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
                                                            form.setValue("sourceId", acc.id)
                                                            setSource(acc)
                                                        }}
                                                        onClick={() => {
                                                            form.setValue("sourceId", acc.id)
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
                    name="targetId"
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
                                                "w-full justify-between gap-4",
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
                                                            form.setValue("targetId", acc.id)
                                                            setTarget(acc)
                                                        }}
                                                        onClick={() => {
                                                            form.setValue("targetId", acc.id)
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
            </form>
        </Form>
    )
}