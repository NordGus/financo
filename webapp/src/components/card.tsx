import Summary from "@/types/Summary";

import currencyAmountColor from "@helpers/currencyAmountColor";
import currencyAmountToHuman from "@helpers/currencyAmountToHuman";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Area, AreaChart, XAxis } from "recharts";
import moment from "moment";
import { Currency } from "dinero.js";
import { format } from "date-fns";

function mapColor(currency: Currency): string {
    if (currency === "CAD") return "#a10303"
    if (currency === "USD") return "#179625"
    if (currency === "AUD") return "#0340a1"
    if (currency === "EUR") return "#4287f5"
    if (currency === "CHF") return "#02fafa"
    if (currency === "GBP") return "#0062ff"
    if (currency === "RUB") return "#ff8787"
    if (currency === "JPY") return "#fa0202"
    if (currency === "CNY") return "#fafa02"

    return "#FFFFFF"
}

export function CardSummary({
    title,
    summaries,
    className,
}: { title: string, summaries: Summary[], className?: string }) {
    const seriesSize = summaries.map(({ series }) => series).filter((val) => !!val).flat().length
    const conf = Object.entries(summaries).filter(([key, _]: [string, any]) => key === "currency")
        .map((entry) => ({ [entry[1].toString().toLowerCase()]: { label: entry[1].toString() } }))
    let val = {}

    for (let i = 0; i < conf.length; i++) {
        val = { ...val, ...conf[i] };
    }

    const chartConfig = { ...val } satisfies ChartConfig

    return (
        <Card className={className}>
            <CardHeader className="space-y-0 pb-0">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="flex flex-row gap-2">
                    {
                        summaries.map(({ amount, currency }) => <div
                            key={`${title.replace(" ", "").toLowerCase()}:${currency}`}
                            className={cn("text-2xl font-bold", currencyAmountColor(amount, false))}
                        >
                            {currencyAmountToHuman(Math.abs(amount), currency)}
                        </div>)
                    }
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {
                    seriesSize === 0
                        ? <div className="min-h-[150px] h-[150px] max-h-[150px] w-full contents-['']"></div>
                        : <ChartContainer
                            config={chartConfig}
                            className="min-h-[150px] h-[150px] max-h-[150px] w-full"
                        >
                            <AreaChart accessibilityLayer margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                                <defs>
                                    {
                                        summaries.map(({ currency }) => (
                                            <linearGradient id={currency} x1="0" y1="0" x2="0" y2="1">
                                                <stop
                                                    offset="5%"
                                                    stopColor={mapColor(currency)}
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor={mapColor(currency)}
                                                    stopOpacity={0.1}
                                                />
                                            </linearGradient>
                                        ))
                                    }
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    hide={true}
                                    allowDuplicatedCategory={false}
                                />
                                <ChartTooltip
                                    labelFormatter={(value) => format(moment(value).toDate(), 'PPP')}
                                    content={<ChartTooltipContent />}
                                />
                                {
                                    summaries.map(({ currency, series }) => (
                                        <Area
                                            name={currency}
                                            key={`summary:${currency}`}
                                            dataKey="amount"
                                            data={
                                                series?.map(({ date, amount }) => (
                                                    { date: date, amount: amount / 100 }
                                                )) || []
                                            }
                                            type="monotone"
                                            stroke={mapColor(currency)}
                                            fill={`url(#${currency})`}
                                            fillOpacity={0.4}
                                        />
                                    ))
                                }
                            </AreaChart>
                        </ChartContainer>
                }
            </CardContent>
        </Card>
    )
}