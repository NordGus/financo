import { cn } from "@/lib/utils";
import { Icon, Kind } from "@/types/Account";
import { createAccount } from "@api/accounts";
import { getCurrencies } from "@api/currencies";
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
import { Input } from "@components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { Textarea } from "@components/ui/textarea";
import { useToast } from "@components/ui/use-toast";
import isDebtAccount, { isCreditAccount } from "@helpers/account/isDebtAccount";
import currencyAmountColor from "@helpers/currencyAmountColor";
import currencyAmountToHuman from "@helpers/currencyAmountToHuman";
import { zodResolver } from "@hookform/resolvers/zod";
import { staleTimeDefault } from "@queries/client";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Currency } from "dinero.js";
import { isEmpty } from "lodash";
import { CheckIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { schema } from "./schema";

interface NewProps {
    setOpen: Dispatch<SetStateAction<boolean>>
}

type CreatableKinds = Kind.CapitalNormal |
    Kind.CapitalSavings |
    Kind.DebtLoan |
    Kind.DebtPersonal |
    Kind.DebtCredit |
    Kind.ExternalExpense |
    Kind.ExternalIncome;

const kinds: Array<{ code: CreatableKinds, name: string }> = [
    { code: Kind.CapitalNormal, name: "Bank or Cash Account" },
    { code: Kind.CapitalSavings, name: "Savings Account" },
    { code: Kind.DebtLoan, name: "Loan" },
    { code: Kind.DebtPersonal, name: "Personal Loan" },
    { code: Kind.DebtCredit, name: "Credit Line" },
    { code: Kind.ExternalExpense, name: "Expense or Outgoing Capital" },
    { code: Kind.ExternalIncome, name: "Income or Incoming Capital" },
]

export function NewAccountForm({ setOpen }: NewProps) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [currency, setCurrency] = useState<Currency>("EUR")
    const [kind, setKind] = useState<CreatableKinds>(Kind.CapitalNormal)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            kind: Kind.CapitalNormal,
            currency: "EUR",
            capital: 0,
            icon: Icon.Base,
        }
    })

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            const created = await createAccount({
                ...values,
                capital: isDebtAccount(values.kind) ? values.capital : 0
            })

            toast({
                title: "Created",
                description: `${created.name} has been created`
            })

            setOpen(false)

            queryClient.invalidateQueries({ queryKey: ["accounts"] })

            navigate(`/accounts/${created.id}`)
        } catch (e) {
            console.error(e)

            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "There was a problem creating the account"
            })
        }
    }

    const { data: currencies, isError, error } = useQuery({
        queryKey: ["currencies"],
        queryFn: getCurrencies,
        staleTime: staleTimeDefault
    })

    if (isError) throw error

    useEffect(() => {
        if (!isEmpty(form.formState.errors)) console.error("errors:", form.formState.errors)
    }, [form.formState.errors])

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 py-4 text-zinc-950 dark:text-zinc-50"
            >
                <FormField
                    control={form.control}
                    name="kind"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Kind</FormLabel>
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
                                                    ? kinds?.find(
                                                        ({ code }) => code === field.value
                                                    )?.name
                                                    : "Select Account Kind"
                                            }
                                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search account kind..."
                                            className="h-9"
                                        />
                                        <CommandList>
                                            <CommandEmpty>No Kind matches.</CommandEmpty>
                                            <CommandGroup>
                                                {kinds?.map(({ code, name }) => (
                                                    <CommandItem
                                                        value={name}
                                                        key={code}
                                                        onSelect={() => {
                                                            form.setValue("kind", code)
                                                            setKind(code)
                                                        }}
                                                        onClick={() => {
                                                            form.setValue("kind", code)
                                                            setKind(code)
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
                            <FormMessage />
                        </FormItem>
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
                    name="color"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="color"
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
                {
                    isDebtAccount(kind) && (
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
                                        {
                                            isCreditAccount(kind)
                                                ? "Represents the credit line's limit. "
                                                : "Represents the amount of the loan. "
                                        }
                                        A positive value indicates that you owe money. While a negative one indicates that you're owed money.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )
                }
                <Button type="submit">Create</Button>
            </form>
        </Form>
    )
}