import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFetcher } from "react-router";
import { z } from "zod";
import { CurrencyInput } from "~/shared/components/inputs/currency-input";
import { IconInput } from "~/shared/components/inputs/icon-input";
import { Throbber } from "~/shared/components/throbber";
import { Button } from "~/shared/components/ui/button";
import { DialogFooter, DialogHeader, DialogTitle } from "~/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/shared/components/ui/form";
import { Input } from "~/shared/components/ui/input";
import { Textarea } from "~/shared/components/ui/textarea";
import { isCategory, isExpense, Kind } from "~/shared/types/account";
import { Currency } from "~/shared/types/currency";
import { ICONS } from "~/shared/types/icon";
import { Created } from "../../types/create";
import { schema } from "../schemas/create";

interface Props {
  kind: Kind
  defaultCurrency: Currency
  onSuccess: () => void
}

export function CreateCategory({ kind, defaultCurrency, onSuccess }: Props) {
  if (!isCategory(kind)) throw new Error(`CreateCategory invalid kind ${kind}`)

  const [loading, setLoading] = useState(false)
  const fetcher = useFetcher<Created | null>({ key: `categories.create.${kind}` })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      kind: kind,
      currency: defaultCurrency,
      icon: isExpense(kind) ? ICONS.bookmark : ICONS.banknote,
      intent: "create"
    }
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true)

    await fetcher.submit(
      values,
      { action: "/categories", method: "post", encType: "application/json" }
    )
  }

  useEffect(() => {
    setLoading(false)

    if (loading && fetcher.data) onSuccess()
  }, [fetcher.data])

  return (
    <>
      <Form {...form}>
        <DialogHeader className="flex flex-row gap-4 items-center">
          <DialogTitle>
            {isExpense(kind) ? "Create Expense Category" : "Create Income Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <IconInput value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input {...field} type={"color"} className="cursor-pointer" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="You can add a little extra information about this Account."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can leave this empty
                </FormDescription>
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
                <CurrencyInput onValueChange={field.onChange} defaultValue={field.value} />
                <FormDescription>
                  The currency this account will operate in with
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit" className="min-w-24" disabled={loading}>
              {loading ? <Throbber size={"sm"} /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}