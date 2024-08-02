import Summary from "@/types/Summary";

import currencyAmountColor from "@helpers/currencyAmountColor";
import currencyAmountToHuman from "@helpers/currencyAmountToHuman";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function CardSummary({
    title,
    balances,
    className,
}: { title: string, balances: Summary[], className?: string }) {
    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {
                    balances.map(({ amount, currency }) => <div
                        key={`${title.replace(" ", "").toLowerCase()}:${currency}`}
                        className={cn("text-2xl font-bold", currencyAmountColor(amount, false))}
                    >
                        {currencyAmountToHuman(Math.abs(amount), currency)}
                    </div>)
                }
            </CardContent>
        </Card>
    )
}