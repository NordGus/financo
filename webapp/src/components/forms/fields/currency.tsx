import { useQuery } from "@tanstack/react-query"
import { UseFormReturn } from "react-hook-form"
import { Command, CheckIcon } from "lucide-react"
import { CaretSortIcon } from "@radix-ui/react-icons"

import { staleTimeDefault } from "@queries/Client"
import { getCurrencies } from "@api/currencies"
import { cn } from "@/lib/utils"

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@components/ui/form"
import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@components/ui/popover"
import {
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem
} from "@components/ui/command"
import { Button } from "@components/ui/button"

export function CurrencyField({ form, name }: { form: UseFormReturn<any, any>, name: string }) {
    const { data: currencies, isError, error } = useQuery({
        queryKey: ["currencies"],
        queryFn: getCurrencies,
        staleTime: staleTimeDefault
    })

    if (isError) throw error

    return <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem className="flex flex-col">
                <FormLabel>Currency</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground"
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
}