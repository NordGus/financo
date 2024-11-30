import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "~/lib/utils";
import { InfoDialog } from "~/shared/components/dialogs/info";
import { CurrencyInput } from "~/shared/components/inputs/currency-input";
import { Button } from "~/shared/components/ui/button";
import { DialogFooter, DialogHeader } from "~/shared/components/ui/dialog";
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
import { Label } from "~/shared/components/ui/label";
import { Switch } from "~/shared/components/ui/switch";
import { Textarea } from "~/shared/components/ui/textarea";
import { accountKindsManual } from "../../manual/account-kinds-manual";
import { hasIncompleteLedgerManual } from "../../manual/has-incomplete-ledger-manual";
import { schema } from "../../schemas/create-capital-account";

export function CreateCapitalAccount() {
  const [hasIncompleteLedger, setHasIncompleteLedger] = useState(false)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  })

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log(values)
  }

  useEffect(() => {
    if (hasIncompleteLedger) {
      form.setValue("history.at", new Date())
      form.setValue("history.balance", 0)
    } else {
      form.setValue("history.at", undefined)
      form.setValue("history.balance", undefined)
    }
  }, [hasIncompleteLedger])

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          <div className="flex gap-2 items-center">
            New Capital Account <InfoDialog copy={accountKindsManual.capital} />
          </div>
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
          <div className="flex items-center space-x-2">
            <Switch id="has-form" checked={hasIncompleteLedger} onCheckedChange={setHasIncompleteLedger} />
            <Label htmlFor="has-form">Has incomplete an incomplete ledger</Label>
            <InfoDialog copy={hasIncompleteLedgerManual} />
          </div>
          <div
            className={cn("flex flex-col gap-4", hasIncompleteLedger ? "h-fit" : "h-0")}
          >
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
          </div>
          <DialogFooter>
            <Button type="submit">
              Create
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
