import { zodResolver } from "@hookform/resolvers/zod";
import { PackageIcon, PackageOpenIcon, TrashIcon } from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";
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
import { isCapital, isCredit, isLoan, isPassive } from "~/modules/shared/types/account";
import { accountKindsManual } from "../../manual/account-kinds-manual";
import { capitalManual } from "../../manual/capital-manual";
import { hasIncompleteLedgerManual } from "../../manual/has-incomplete-ledger-manual";
import { mainAccountManual } from "../../manual/main-account-manual";
import { schema, schemaWithCapital } from "../../schemas/update";
import { Account } from "../../types/accounts";
import { OnSubmitUpdateAccountAction } from "../../types/update";

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenDeleteChange: (open: boolean) => void
  onOpenArchiveChange: (open: boolean) => void
  onOpenUnarchiveChange: (open: boolean) => void
  account: Account
  onSubmitAction: OnSubmitUpdateAccountAction
  submitting: boolean
}

export function UpdateAccount({
  open,
  onOpenChange,
  account,
  onSubmitAction,
  onOpenDeleteChange,
  onOpenArchiveChange,
  onOpenUnarchiveChange,
  submitting
}: Props) {
  return (
    <Drawer modal open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="overflow-clip">
        <DrawerHeader>
          <DrawerTitle>
            New {accountKindToHuman(account.kind)} Account <InfoDialog copy={accountKindsManual[account.kind]} />
          </DrawerTitle>
        </DrawerHeader>
        <UpdateForm
          account={account}
          onSubmitAction={onSubmitAction}
          onOpenDeleteChange={onOpenDeleteChange}
          onOpenArchiveChange={onOpenArchiveChange}
          onOpenUnarchiveChange={onOpenUnarchiveChange}
          submitting={submitting}
        />
      </DrawerContent>
    </Drawer>
  )
}

interface FormProps {
  account: Account
  onOpenDeleteChange: (open: boolean) => void
  onOpenArchiveChange: (open: boolean) => void
  onOpenUnarchiveChange: (open: boolean) => void
  onSubmitAction: OnSubmitUpdateAccountAction
  submitting: boolean
}

function UpdateForm({
  account,
  onSubmitAction,
  onOpenDeleteChange,
  onOpenArchiveChange,
  onOpenUnarchiveChange,
  submitting
}: FormProps) {
  const isFixedSignDebt = isCredit(account.kind) || isLoan(account.kind)
  const forDebts = isPassive(account.kind)
  const withCapital = isPassive(account.kind)
  const historyAt = account.additionalData.history?.at
    ? moment(account.additionalData.history.at).toDate()
    : undefined
  const historyBalance = account.additionalData.history?.balance ?? undefined

  const [hasIncompleteLedger, setHasIncompleteLedger] = useState(!!historyAt)

  const formSchema = useMemo(() => forDebts ? schemaWithCapital : schema, [forDebts])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: account.id,
      name: account.name,
      description: account.description || undefined,
      currency: account.currency,
      capital: account.capital,
      color: account.color,
      icon: account.icon,
      history: { at: historyAt, balance: historyBalance },
      main: isCapital(account.kind) ? account.additionalData.main : false,
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) =>
    await onSubmitAction({
      ...values,
      history: {
        balance: values.history?.balance ?? null,
        at: values.history?.at
          ? moment(values.history.at).utc().toISOString()
          : null,
      }
    })

  const onHasIncompleteLedger = (value: boolean) => {
    setHasIncompleteLedger(() => {
      form.setValue("history.at", value ? historyAt : undefined)
      form.setValue("history.balance", value ? historyBalance : undefined)

      return value
    })
  }

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
                  <FormControl>
                    <IconInput
                      value={field.value}
                      onChange={field.onChange}
                      entity="account"
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
            isCapital(account.kind) && (
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
            <Switch id="has-form" checked={hasIncompleteLedger} onCheckedChange={onHasIncompleteLedger} />
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
            {submitting ? <Throbber size={"sm"} /> : "Update"}
          </Button>
          {
            account.archivedAt
              ? <Button
                variant={"secondary"}
                onClick={() => onOpenUnarchiveChange(true)}
                disabled={submitting}
                type="button"
              >
                <PackageOpenIcon /> Unarchive
              </Button>
              : <Button
                variant={"secondary"}
                onClick={() => onOpenArchiveChange(true)}
                disabled={submitting}
                type="button"
              >
                <PackageIcon /> Archive
              </Button>
          }
          <Button
            variant={"destructive"}
            onClick={() => onOpenDeleteChange(true)}
            disabled={submitting}
            type="button"
          >
            <TrashIcon /> Delete
          </Button>
          <DrawerClose asChild>
            <Button variant={"outline"} type="button" disabled={submitting}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </form>
    </Form>
  )
}
