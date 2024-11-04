import { cn } from "@/lib/utils";
import { SavingsGoal } from "@/types/savings-goal";
import { getCurrencies } from "@api/currencies";
import { updateSavingsGoal } from "@api/savings-goals";
import { Button } from "@components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@components/ui/command";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { SheetHeader, SheetTitle } from "@components/ui/sheet";
import { Textarea } from "@components/ui/textarea";
import { useToast } from "@components/ui/use-toast";
import currencyAmountColor from "@helpers/currencyAmountColor";
import currencyAmountToHuman from "@helpers/currencyAmountToHuman";
import { zodResolver } from "@hookform/resolvers/zod";
import { staleTimeDefault } from "@queries/client";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Currency } from "dinero.js";
import { isEmpty } from "lodash";
import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { schema } from "./schema";

interface Props {
    goal: SavingsGoal
    onSetOpenForm: (open: boolean) => void
}

function EditForm({ goal, onSetOpenForm }: Props) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [currency, setCurrency] = useState<Currency>(goal.settings.currency)
    const { toast } = useToast()
    const { data: currencies, isError, error } = useQuery({
        queryKey: ["currencies"],
        queryFn: getCurrencies,
        staleTime: staleTimeDefault
    })

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            id: goal.id,
            name: goal.name,
            description: goal.description ?? undefined,
            currency: goal.settings.currency,
            target: goal.settings.target
        }
    })

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            const { name, currency, target } = await updateSavingsGoal(values)

            toast({
                title: "Updated",
                description: `Your goal ${name} to reach ${currencyAmountToHuman(target, currency)} has been updated`
            })

            onSetOpenForm(false)

            await queryClient.invalidateQueries({ queryKey: ["achievements", "savings-goals", "active"] })

            navigate(`/achievements`)
        } catch (e) {
            console.error(e)

            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "There was a problem updating the savings goal"
            })
        }
    }

    if (isError) throw error

    useEffect(() => {
        if (!isEmpty(form.formState.errors)) console.error("errors:", form.formState.errors)
    }, [form.formState.errors])

    return (
        <>
            <SheetHeader>
                <SheetTitle>Edit Savings Goal</SheetTitle>
            </SheetHeader>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 pt-4 text-zinc-950 dark:text-zinc-50"
                >
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
                                        placeholder="Remind you what you want to achieve with this"
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
                                    This is the currency of the savings that the goal is going to track
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="target"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Target</FormLabel>
                                <FormControl>
                                    <div className="flex flex-row gap-4 justify-between items-center">
                                        <Input
                                            {...field}
                                            placeholder={"Target"}
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
                                <FormDescription>How much you plan to save</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Save</Button>
                </form>
                <Dialog>
                    <div className="flex flex-col pt-4">
                        <DialogTrigger asChild>
                            <Button variant="secondary">Mark as Achieved</Button>
                        </DialogTrigger>
                    </div>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                You are about to mark this Savings Goal as Achieved
                            </DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            Are you sure you want to mark <span className="font-bold">{goal.name}</span> as achieved?
                        </DialogDescription>
                        <DialogFooter className="grid grid-cols-2 gap-4">
                            {/* TODO: implement marking as achieved mechanism */}
                            <Button>Confirm</Button>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Cancel
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <div className="flex flex-col pt-4">
                        <DialogTrigger asChild>
                            <Button variant="destructive">Delete</Button>
                        </DialogTrigger>
                    </div>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>You are about to delete this Savings Goal</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-bold">{goal.name}</span>?
                        </DialogDescription>
                        <DialogFooter className="grid grid-cols-2 gap-4">
                            {/* TODO: implement deletion mechanism */}
                            <Button>Confirm</Button>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Cancel
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Form>
        </>
    )
}

export { EditForm };
