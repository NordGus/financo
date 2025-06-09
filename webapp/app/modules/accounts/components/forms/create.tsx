import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InfoDialog } from "~/modules/shared/components/dialogs/info";
import { CurrencyAmountInput } from "~/modules/shared/components/inputs/currency-amount-input";
import { CurrencyInput } from "~/modules/shared/components/inputs/currency-input";
import { DateInput } from "~/modules/shared/components/inputs/date-input";
import { IconInput } from "~/modules/shared/components/inputs/icon-input";
import { Throbber } from "~/modules/shared/components/throbber";
import { Accordion, AccordionContent, AccordionItem } from "~/modules/shared/components/ui/accordion";
import { Button } from "~/modules/shared/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "~/modules/shared/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/modules/shared/components/ui/form";
import { Input } from "~/modules/shared/components/ui/input";
import { Label } from "~/modules/shared/components/ui/label";
import { Switch } from "~/modules/shared/components/ui/switch";
import { Textarea } from "~/modules/shared/components/ui/textarea";
import { accountKindToHuman } from "~/modules/shared/helpers/account-kind-to-human";
import { isCapital, isCredit, isDebt, isPassive } from "~/modules/shared/types/account";
import { Currency } from "~/modules/shared/types/currency";
import { Icon } from "~/modules/shared/types/icon";
import { accountKindsManual } from "../../manual/account-kinds-manual";
import { capitalManual } from "../../manual/capital-manual";
import { hasIncompleteLedgerManual } from "../../manual/has-incomplete-ledger-manual";
import { mainAccountManual } from "../../manual/main-account-manual";
import { schema, schemaWithCapital } from "../../schemas/create";
import { Kind } from "../../types/accounts";
import { OnSubmitCreateAccountAction } from "../../types/create";
import { defaultIcons } from "../../types/icons";

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  kind: Kind
  defaultCurrency: Currency
  onSubmitAction: OnSubmitCreateAccountAction
  submitting: boolean
}

export function CreateAccount({ open, onOpenChange, defaultCurrency, kind, submitting, onSubmitAction }: Props) {
  return (
    <Drawer modal open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="overflow-clip">
        <DrawerHeader>
          <DrawerTitle>
            New {accountKindToHuman(kind)} Account <InfoDialog copy={accountKindsManual[kind]} />
          </DrawerTitle>
        </DrawerHeader>
        <CreateForm
          kind={kind}
          defaultIcon={defaultIcons[kind]}
          defaultCurrency={defaultCurrency}
          onSubmitAction={onSubmitAction}
          submitting={submitting}
        />
      </DrawerContent>
    </Drawer>
  )
}

interface FormProps {
  kind: Kind
  defaultCurrency: Currency
  defaultIcon: Icon
  onSubmitAction: OnSubmitCreateAccountAction
  submitting: boolean
}

function CreateForm({ kind, defaultCurrency, defaultIcon, submitting, onSubmitAction }: FormProps) {
  const isFixedSignDebt = isCredit(kind) || isDebt(kind)
  const forDebts = isPassive(kind)
  const withCapital = forDebts
  const [hasIncompleteLedger, setHasIncompleteLedger] = useState(false)

  const formSchema = useMemo(() => withCapital ? schemaWithCapital : schema, [withCapital])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kind: kind,
      name: "",
      description: "",
      currency: defaultCurrency,
      capital: 0,
      color: {
        capital: "#31e2c2",
        savings: "#0b8fe8",
        credit: "#008afc",
        debt: "#fc004f",
      }[kind],
      history: {},
      icon: defaultIcon,
      main: false,
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) =>
    await onSubmitAction({
      ...values,
      history: {
        balance: values.history?.balance || null,
        at: values.history?.at
          ? moment(values.history.at).utc().toISOString()
          : null,
      }
    })

  const onHasIncompleteLedgerChange = (value: boolean) => {
    setHasIncompleteLedger(() => {
      form.setValue("history.at", value ? new Date() : undefined)
      form.setValue("history.balance", value ? 0 : undefined)

      return value
    })
  }

  useEffect(() => {

  }, [])

  useEffect(() => {
    if (Object.keys(form.formState.errors).length === 0) return

    console.error(form.formState.errors)
  }, [form.formState.errors])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-h-[85dvh] overflow-auto"
      >
        <div className="flex flex-col gap-4 px-4">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <IconInput
                    value={field.value}
                    onChange={field.onChange}
                  />
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
                <CurrencyInput onValueChange={field.onChange} defaultValue={field.value} value={field.value} />
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
            <Switch id="has-form" checked={hasIncompleteLedger} onCheckedChange={onHasIncompleteLedgerChange} />
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
        </div>
        <DrawerFooter>
          <Button type="submit" className="min-w-24" disabled={submitting}>
            {submitting ? <Throbber size={"sm"} /> : "Create"}
          </Button>
          <DrawerClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </form>
    </Form>
  )
}