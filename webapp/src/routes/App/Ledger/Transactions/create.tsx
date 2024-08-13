import { cn } from "@/lib/utils";
import { getSelectableAccounts } from "@api/accounts";
import { Button } from "@components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@components/ui/command";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { staleTimeDefault } from "@queries/Client";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { Currency } from "dinero.js";
import { CheckIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import validateCurrencyCode from "validate-currency-code";
import { z } from "zod";

const schema = z.object({
    source: z.object({
        id: z.number({ required_error: "is required", invalid_type_error: "must be a number" }),
        currency: z.custom<Currency>(
            (value) => validateCurrencyCode(value),
            { message: "must be a ISO 4217 currency code" }
        ),
    }),
    target: z.object({
        id: z.number({ required_error: "is required", invalid_type_error: "must be a number" }),
        currency: z.custom<Currency>(
            (value) => validateCurrencyCode(value),
            { message: "must be a ISO 4217 currency code" }
        ),
    }),
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

interface Props {
    setOpen: Dispatch<SetStateAction<boolean>>
}

export default function Crete({ setOpen }: Props) {
    const accounts = useQuery({
        queryKey: ["accounts", "select"],
        queryFn: getSelectableAccounts,
        staleTime: staleTimeDefault,
    })

    const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })

    const onSubmit = async (values: z.infer<typeof schema>) => {
        console.log(values)
    }

    if (accounts.isError) throw accounts.error

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="pt-4 flex flex-col gap-4 text-zinc-950 dark:text-zinc-50"
            >
                <FormField
                    control={form.control}
                    name="source.id"
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
                                                "w-full justify-between",
                                                !field.value && "text-zin-500"
                                            )}
                                        >
                                            {
                                                field.value
                                                    ? accounts.data?.find(
                                                        ({ id }) => id === field.value
                                                    )?.name
                                                    : "Select source account"
                                            }
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
                                                {accounts.data?.
                                                    filter(({ id }) => (
                                                        id !== form.getValues("target.id")
                                                    ))?.map((account) => {
                                                        const arr = [{
                                                            id: account.id,
                                                            name: account.name,
                                                            currency: account.currency
                                                        }]

                                                        if (account.children) {
                                                            arr.push(
                                                                ...account.children.map((child) => {
                                                                    return {
                                                                        id: child.id,
                                                                        name: `${account.name} (${child.name})`,
                                                                        currency: child.currency
                                                                    }
                                                                })
                                                            )
                                                        }

                                                        return arr
                                                    })?.flat(1)?.map(({ id, name, currency }) => (
                                                        <CommandItem
                                                            value={name}
                                                            key={id}
                                                            onSelect={() => {
                                                                form.setValue("source.id", id)
                                                                form.setValue("source.currency", currency)
                                                            }}
                                                            onClick={() => {
                                                                form.setValue("source.id", id)
                                                                form.setValue("source.currency", currency)
                                                            }}
                                                        >
                                                            {name}
                                                            <CheckIcon
                                                                className={cn(
                                                                    "ml-auto h-4 w-4",
                                                                    id === field.value
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
                    name="target.id"
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
                                                "w-full justify-between",
                                                !field.value && "text-zin-500"
                                            )}
                                        >
                                            {
                                                field.value
                                                    ? accounts.data?.find(
                                                        ({ id }) => id === field.value
                                                    )?.name
                                                    : "Select source account"
                                            }
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
                                                {accounts.data?.
                                                    filter(({ id }) => (
                                                        id !== form.getValues("source.id")
                                                    ))?.map((account) => {
                                                        const arr = [{
                                                            id: account.id,
                                                            name: account.name,
                                                            currency: account.currency
                                                        }]

                                                        if (account.children) {
                                                            arr.push(
                                                                ...account.children.map((child) => {
                                                                    return {
                                                                        id: child.id,
                                                                        name: `${account.name} (${child.name})`,
                                                                        currency: child.currency
                                                                    }
                                                                })
                                                            )
                                                        }

                                                        return arr
                                                    })?.flat(1)?.map(({ id, name, currency }) => (
                                                        <CommandItem
                                                            value={name}
                                                            key={id}
                                                            onSelect={() => {
                                                                form.setValue("source.id", id)
                                                                form.setValue("source.currency", currency)
                                                            }}
                                                            onClick={() => {
                                                                form.setValue("source.id", id)
                                                                form.setValue("source.currency", currency)
                                                            }}
                                                        >
                                                            {name}
                                                            <CheckIcon
                                                                className={cn(
                                                                    "ml-auto h-4 w-4",
                                                                    id === field.value
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