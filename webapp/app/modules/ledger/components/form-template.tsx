import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Save, Trash } from "lucide-react";
import { ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { useSubmit } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "~/lib/utils";
import { Button } from "~/modules/shared/components/ui/button";
import { Form } from "~/modules/shared/components/ui/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/modules/shared/components/ui/tooltip";
import { CURRENCIES, Currency } from "~/modules/shared/types/currency";
import { DATE_FORMAT, Kind, KINDS } from "../types/transactions";

const schema = z.object({
  sourceId: z.number().positive(),
  targetId: z.number().positive(),
  sourceAmount: z.number(),
  targetAmount: z.number(),
  issuedAt: z.date(),
  executedAt: z.date().nullish(),
  currency: z.nativeEnum(CURRENCIES),
  kind: z.nativeEnum(KINDS)
})

type Transaction = {
  sourceId: number
  targetId: number
  sourceAmount: number
  targetAmount: number
  issuedAt: Date
  executedAt: Date | null | undefined
  currency: Currency,
  kind: Kind
}

function capitalizeKind(kind: Kind): string {
  return `${kind.at(0)!.toLocaleUpperCase()}${kind.slice(1)}`
}

type Props = {
  transaction: Transaction
  role: "create" | "update"
}

export function FormTemplate({ transaction, className, role, ...props }: ComponentProps<"form"> & Props) {
  const submit = useSubmit()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      sourceId: transaction.sourceId,
      targetId: transaction.targetId,
      sourceAmount: transaction.sourceAmount,
      targetAmount: transaction.targetAmount,
      issuedAt: transaction.issuedAt,
      executedAt: transaction.executedAt,
      currency: transaction.currency,
      kind: transaction.kind,
    }
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const promise = submit({
      ...values,
      issuedAt: format(values.issuedAt, DATE_FORMAT),
      executedAt: values.executedAt ? format(values.executedAt, DATE_FORMAT) : null,
      intent: role
    }, { method: "post", encType: "application/json" })

    toast.promise(
      promise,
      {
        loading: "Creating...",
        success: () => {
          if (values.executedAt) {
            return `${capitalizeKind(values.kind)} registered at ${format(values.executedAt, "PPP")}`
          }

          return `Pending ${values.kind} registered at ${format(values.issuedAt, "PPP")}`
        },
        error: "Oops!. Something went wrong"
      }
    )
  }

  const onDestroy = async () => {
    const promise = submit({
      ...transaction,
      issuedAt: format(transaction.issuedAt, DATE_FORMAT),
      executedAt: transaction.executedAt ? format(transaction.executedAt, DATE_FORMAT) : null,
      intent: "destroy"
    }, { method: "post", encType: "application/json" })

    toast.promise(
      promise,
      {
        loading: "Deleting...",
        success: () => "Transaction deleted",
        error: "Oops!. Something went wrong"
      }
    )
  }

  return (
    <Form {...form}>
      <form
        className={cn("grid grid-cols-2 grid-rows-[min-content_0.75fr_1fr_0.5fr_min-content_0.75fr_min-content] h-full max-h-full gap-2 overflow-y-auto no-scrollbar", className)}
        {...props}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="col-span-2 flex gap-2 justify-end">
          {
            role === "update" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="destructive" size={"icon"} onClick={onDestroy}>
                    <Trash />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {"Delete Transaction"}
                </TooltipContent>
              </Tooltip>
            )
          }
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" size={"icon"}>
                <Save />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {
                role === "update"
                  ? "Update Transaction"
                  : "Create Transaction"
              }
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="rounded-lg border">
          From account
        </div>
        <div className="rounded-lg border">
          To account
        </div>
        <div className="rounded-lg bg-zinc-700">
          Source amount
        </div>
        <div className="rounded-lg bg-zinc-700">
          Target amount
        </div>
        <div className="rounded-lg border">
          Issued {format(transaction.issuedAt, "LLL dd, y")}
        </div>
        <div className="rounded-lg border">
          Effective {format(transaction.issuedAt, "LLL dd, y")}
        </div>
        <div className="col-span-2">
          Date controls
        </div>
        <div className="rounded-lg border col-span-2">
          Notes
        </div>

        <div className="grid col-span-2 grid-cols-5 grid-rows-4 gap-2 mx-auto w-full max-w-[45dvh]">
          <div className="rounded-lg border aspect-square">div</div>
          <div className="rounded-lg border aspect-square">7</div>
          <div className="rounded-lg border aspect-square">8</div>
          <div className="rounded-lg border aspect-square">9</div>
          <div className="rounded-lg border aspect-square">back</div>
          <div className="rounded-lg border aspect-square">by</div>
          <div className="rounded-lg border aspect-square">4</div>
          <div className="rounded-lg border aspect-square">5</div>
          <div className="rounded-lg border aspect-square">6</div>
          <div className="rounded-lg border aspect-square">date</div>
          <div className="rounded-lg border aspect-square">minus</div>
          <div className="rounded-lg border aspect-square">1</div>
          <div className="rounded-lg border aspect-square">2</div>
          <div className="rounded-lg border aspect-square">3</div>
          <div className="rounded-lg border row-span-2">done</div>
          <div className="rounded-lg border aspect-square">plus</div>
          <div className="rounded-lg border aspect-square">curr</div>
          <div className="rounded-lg border aspect-square">0</div>
          <div className="rounded-lg border aspect-square">info</div>
        </div>
      </form>
    </Form>
  )
}