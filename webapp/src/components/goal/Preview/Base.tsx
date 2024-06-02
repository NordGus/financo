import Goal from "@/types/Goal";
import currencyAmountColor from "@helpers/currencyAmountColor";
import currencyAmountToHuman from "@helpers/currencyAmountToHuman";

import Progress from "@components/Progress";
import { useMemo } from "react";

interface GoalPreviewProps {
    goal: Goal
}

export default function Base({
    goal: {
        name,
        description,
        goal,
        balance,
        currency,
        archived,
        fulfilled
    }
}: GoalPreviewProps) {
    const fulfilledAt = useMemo(() => new Date(Date.parse(fulfilled.at)), [fulfilled.at])

    return (<>
        <div
            className={`flex flex-col justify-center min-h-16 leading-snug ${archived ? "col-span-2" : ""}`}
        >
            <p>{name}</p>
            <div className="flex justify-between text-sm gap-1">
                {
                    archived
                        ? <p className={currencyAmountColor(0)}>Archived</p>
                        : fulfilled.reached
                            ? <>
                                <p className={currencyAmountColor(0)}>Reached</p>
                                <p className={`flex-grow ${currencyAmountColor(0)}`}>
                                    {
                                        fulfilledAt.toLocaleDateString(
                                            undefined,
                                            {
                                                weekday: "short",
                                                year: "numeric",
                                                month: "long",
                                                day: "2-digit"
                                            }
                                        )
                                    }
                                </p>
                            </>
                            : <p className={currencyAmountColor(balance)}>
                                {currencyAmountToHuman(balance, currency)}
                            </p>
                }
                <p className={currencyAmountColor(0)}>
                    {currencyAmountToHuman(goal, currency)}
                </p>
            </div>
            <p className={`text-xs ${currencyAmountColor(0)}`}>{description}</p>
        </div>
        {
            !archived &&
            <Progress progress={fulfilled.reached ? 1 : Math.abs(balance / goal)} />
        }
    </>)
}