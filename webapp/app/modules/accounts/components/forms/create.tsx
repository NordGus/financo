import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFetcher } from "react-router";
import { z } from "zod";
import { InfoDialog } from "~/shared/components/dialogs/info";
import { CurrencyAmountInput } from "~/shared/components/inputs/currency-amount-input";
import { CurrencyInput } from "~/shared/components/inputs/currency-input";
import { DateInput } from "~/shared/components/inputs/date-input";
import { IconInput } from "~/shared/components/inputs/icon-input";
import { Throbber } from "~/shared/components/throbber";
import { Accordion, AccordionContent, AccordionItem } from "~/shared/components/ui/accordion";
import { Button } from "~/shared/components/ui/button";
import { DialogFooter } from "~/shared/components/ui/dialog";
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
import { isCapital, isCredit, isDebt, isLoan, Kind } from "~/shared/types/account";
import { Currency } from "~/shared/types/currency";
import { Icon } from "~/shared/types/icon";
import { capitalManual } from "../../manual/capital-manual";
import { hasIncompleteLedgerManual } from "../../manual/has-incomplete-ledger-manual";
import { mainAccountManual } from "../../manual/main-account-manual";
import { schema } from "../../schemas/create";
import { Created } from "../../types/create";

interface Props {
  kind: Kind
  defaultCurrency: Currency
  defaultIcon: Icon
  keyId: number
  onSuccess: () => void
  withCapital?: boolean
}

export function CreateAccount({
  defaultIcon,
  defaultCurrency,
  kind,
  keyId,
  onSuccess,
  withCapital = false,
}: Props) {
  const isFixedSignDebt = isCredit(kind) || isLoan(kind)
  const forDebts = isDebt(kind)
  const [hasIncompleteLedger, setHasIncompleteLedger] = useState(false)
  const [loading, setLoading] = useState(false)
  const fetcher = useFetcher<Created | null>({ key: `accounts.create.${kind}.${keyId}` })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      kind: kind,
      currency: defaultCurrency,
      capital: 0,
      icon: defaultIcon,
      main: false,
      intent: "create"
    }
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true)

    await fetcher.submit(
      {
        ...values,
        history: {
          balance: values.history.balance || null,
          at: values.history.at ? moment(values.history.at).utc().toISOString() : null,
        }
      },
      { action: "/accounts", method: "post", encType: "application/json" }
    )
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

  useEffect(() => {
    setLoading(false)

    if (loading && fetcher.data) onSuccess()
  }, [fetcher.data])

  return (
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
        {
          withCapital && (
            <FormField
              control={form.control}
              name="capital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capital <InfoDialog copy={capitalManual} /></FormLabel>
                  <CurrencyAmountInput
                    currency={form.getValues("currency")}
                    value={field.value}
                    onChange={(value) => field.onChange(
                      value && isFixedSignDebt && value > 0
                        ? Math.round(Math.abs(value) * -1)
                        : value
                    )}
                    name="Capital"
                    forDebts={forDebts}
                    fixedSign={isFixedSignDebt}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        }
        {
          isCapital(kind) && (
            <FormField
              control={form.control}
              name="main"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="cursor-pointer">This is my main Account</FormLabel>
                  <InfoDialog copy={mainAccountManual} />
                </FormItem>
              )}
            />
          )
        }
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
  )
}
