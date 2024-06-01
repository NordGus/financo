import { Link } from "react-router-dom";
import Goal from "../../../types/Goal";
import currencyAmountColor from "../../../helpers/currencyAmountColor";
import currencyAmountToHuman from "../../../helpers/currencyAmountToHuman";
import Progress from "../../Progress";

interface Props {
    goal: Goal
}

export default function WithNavigation({
    goal: {
        name,
        description,
        goal,
        balance,
        currency,
        archived,
        fulfilled: {
            reached
        }
    }
}: Props) {
    return (
        <Link
            to={`/accounts`}
            className="grid grid-cols-[minmax(0,_1fr)_min-content] gap-2 px-2 py-1"
        >
            <div
                className={`flex flex-col justify-center min-h-16 leading-snug ${archived ? "col-span-2" : ""}`}
            >
                <p>{name}</p>
                <div className="flex justify-between text-sm">
                    {
                        archived
                            ? <p className={currencyAmountColor(0)}>Archived</p>
                            : reached
                                ? <p className={currencyAmountColor(0)}>Reached</p>
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
                <Progress progress={reached ? 1 : Math.abs(balance / goal)} />
            }
        </Link>
    )
}