import { DynamicIcon } from "lucide-react/dynamic"
import { useMemo } from "react"
import { Label, Pie, PieChart } from "recharts"
import { cn } from "~/lib/utils"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "~/modules/shared/components/ui/chart"
import { colorContrast } from "~/modules/shared/helpers/color-contrast"
import { currencyAmountToHuman } from "~/modules/shared/helpers/currency-amount-to-human"
import { Currency } from "~/modules/shared/types/currency"
import { Accounts } from "../../types/accounts"
import { ExecutedTransaction } from "../../types/transactions"

type Props = {
  transactions: ExecutedTransaction[]
  accounts: Accounts
  title: string
  currency: Currency
}

type ChartEntry = {
  category: string
  amount: number
  currency: Currency
  fill: string
}

export function TransactionsByCategory({ transactions, accounts, title, currency }: Props) {
  const baseConfig = {
    amount: {
      label: "Amount"
    },
  } satisfies ChartConfig

  const data = useMemo(() => {
    return Array.from(transactions.filter(transaction => transaction.currency === currency).reduce(
      (accumulator: Map<number, ChartEntry>, transaction: ExecutedTransaction) => {
        const id = transaction.metadata.kind === "income" ? transaction.sourceId : transaction.targetId
        const amount = transaction.metadata.kind === "income" ? transaction.sourceAmount : transaction.targetAmount
        const account = accounts.get(id)!
        const category = account.parentId === null ? account : accounts.get(account.parentId)!

        if (accumulator.has(category.id)) {
          const entry = accumulator.get(category.id)!

          accumulator.set(category.id, {
            ...entry,
            amount: amount + entry.amount
          })

          return accumulator
        }

        accumulator.set(category.id, {
          category: category.id.toString(),
          amount: amount,
          fill: `var(--color-${category.id})`,
          currency: transaction.currency
        })

        return accumulator
      },
      new Map<number, ChartEntry>()
    ).values())
  }, [transactions, accounts])

  const total = data.reduce((acc, entry) => acc + entry.amount, 0)
  const chartConfig = Array.from(accounts.values()).reduce((config, account) => {
    if (account.parentId) return config
    return {
      ...config,
      [account.id.toString()]: {
        label: account.name,
        color: account.color,
        icon: () => <DynamicIcon name={account.icon} color={account.color} />
      }
    } satisfies ChartConfig
  }, baseConfig)

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart accessibilityLayer syncMethod={"index"}>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              labelClassName="size-5"
              formatter={(value, name) => {
                const account = accounts.get(Number(name))!

                return (
                  <span
                    className="flex items-center gap-2 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0"
                  >
                    <span
                      className={cn(
                        "flex justify-center items-center size-5 rounded-md",
                        (account.kind === "expense" || account.kind === "income") && "rounded-full"
                      )}
                      style={{
                        backgroundColor: account.color,
                        color: colorContrast(account.color)
                      }}
                    >
                      <DynamicIcon name={account.icon} />
                    </span>
                    <span className="">
                      {account.name}
                    </span>
                    <span className="text-right">
                      {currencyAmountToHuman(value as number, currency)}
                    </span>
                  </span>
                )
              }}
            />
          }
        />
        <Pie data={data} dataKey="amount" nameKey="category" innerRadius={85} outerRadius={100} strokeWidth={2} >
          <Label position={"center"} className="fill-foreground text-xl font-bold" dy={-6}>
            {currencyAmountToHuman(total, currency)}
          </Label>
          <Label position={"center"} className="fill-muted-foreground text-xs" dy={16}>
            {title}
          </Label>
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}