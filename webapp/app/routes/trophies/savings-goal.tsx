import { format } from "date-fns";
import { PiggyBank } from "lucide-react";
import { useMemo } from "react";
import z from "zod";
import { get as getMilestonesQuery } from "~/modules/achievements/trophies/api/queries/get";
import { Heading1 } from "~/modules/shared/components/ui/headings";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/modules/shared/components/ui/tooltip";
import { currencyAmountToHuman } from "~/modules/shared/helpers/currency-amount-to-human";
import { CurrenciesForZodEnum } from "~/modules/shared/types/currency";
import { Route } from "./+types/savings-goal";

const milestoneSchema = z.object({
  id: z.number(),
  kind: z.literal("savings_goal"),
  name: z.string(),
  description: z.string().nullish(),
  settings: z.object({
    position: z.number(),
    target: z.number(),
    saved: z.number(),
    currency: z.enum(CurrenciesForZodEnum)
  }),
  achievedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().nullish(),
  updatedAt: z.iso.datetime(),
  createdAt: z.iso.datetime()
})

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = Number(params.id)
  const milestone = milestoneSchema.safeParse(await getMilestonesQuery(id))

  if (!milestone.success) throw milestone.error

  return {
    milestone: milestone.data
  }
}

export default function SavingsGoal({ loaderData }: Route.ComponentProps) {
  const { milestone } = loaderData

  const { name, description, settings } = milestone
  const { target, saved, currency } = settings

  const achievedAt = useMemo(() => new Date(milestone.achievedAt), [milestone.achievedAt])
  const createdAt = useMemo(() => new Date(milestone.createdAt), [milestone.createdAt])

  return (
    <section className="flex flex-col gap-2 overflow-y-hidden my-2 relative">
      <div className="flex flex-col flex-1 gap-2 overflow-y-hidden relative">
        <span
          className="absolute top-0 left-0 right-0 contents-[' '] h-2 bg-linear-to-b from-background to-transparent z-50"
        />
        <div className="flex flex-col gap-2 overflow-y-auto flex-1">
          <div className="grid grid-cols-[min-content_1fr] gap-4 items-center mt-2">
            <Tooltip>
              <TooltipTrigger>
                <PiggyBank className="size-10" />
              </TooltipTrigger>
              <TooltipContent>
                Savings Goal
              </TooltipContent>
            </Tooltip>
            <Heading1>{name}</Heading1>
          </div>
          <div className="text-lg py-3 space-y-1.5">
            {description && <p className="text-muted-foreground">{description}</p>}
            <p>
              Save {currencyAmountToHuman(target, currency)}
            </p>
          </div>
          <div className="text-lg space-y-1.5">
            <p>
              You successfully saved <span className="font-bold">{currencyAmountToHuman(saved, currency)}</span> on <span className="font-bold">{format(achievedAt, "PPP")}</span>
            </p>
            <p className="text-muted-foreground">Created at {format(createdAt, "PPP")}</p>
          </div>
        </div>
        <span
          className="absolute bottom-0 left-0 right-0 contents-[' '] h-2 bg-linear-to-b from-transparent to-background z-50"
        />
      </div>
    </section>
  )
}