import { zodResolver } from "@hookform/resolvers/zod";
import { AccordionItem } from "@radix-ui/react-accordion";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InfoDialog } from "~/shared/components/dialogs/info";
import { CurrencyAmountInput } from "~/shared/components/inputs/currency-amount-input";
import { CurrencyInput } from "~/shared/components/inputs/currency-input";
import { DateInput } from "~/shared/components/inputs/date-input";
import { IconInput } from "~/shared/components/inputs/icon-input";
import { Throbber } from "~/shared/components/throbber";
import { Accordion, AccordionContent } from "~/shared/components/ui/accordion";
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
import { ICONS } from "~/shared/types/icon";
import { accountKindsManual } from "../../manual/account-kinds-manual";
import { hasIncompleteLedgerManual } from "../../manual/has-incomplete-ledger-manual";
import { schema } from "../../schemas/create";

export function CreateCapitalAccount() {
  const [hasIncompleteLedger, setHasIncompleteLedger] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      kind: "capital_normal",
      currency: "EUR",
      capital: 0,
      icon: ICONS.landmark,
      intent: "create"
    }
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true)
    console.log(values)
    //setLoading(false)
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

  console.log(Object.values(ICONS))

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
          <div className="flex items-center space-x-2">
            <Switch id="has-form" checked={hasIncompleteLedger} onCheckedChange={setHasIncompleteLedger} />
            <Label htmlFor="has-form">Has incomplete an incomplete ledger</Label>
            <InfoDialog copy={hasIncompleteLedgerManual} />
          </div>
          <Accordion type="single" value={hasIncompleteLedger ? "opened" : "close"}>
            <AccordionItem value="opened">
              <AccordionContent className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="history.at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starts at</FormLabel>
                      <DateInput value={field.value} onSelect={field.onChange} />
                      <FormDescription>
                        The date from where your ledger starts
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="history.balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting balance</FormLabel>
                      <CurrencyAmountInput
                        currency={form.getValues("currency")}
                        value={field.value}
                        onChange={field.onChange}
                        name="Starting Balance"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
