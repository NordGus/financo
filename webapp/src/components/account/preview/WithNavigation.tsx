import { Link } from "react-router-dom";

import Account, { Kind } from "@/types/Account";
import currencyAmountColor from "@helpers/currencyAmountColor";
import currencyAmountToHuman from "@helpers/currencyAmountToHuman";
import Progress from "@components/Progress";

interface Props {
    account: Account
}

export default function WithNavigation(
    {
        account: {
            id,
            kind,
            name,
            description,
            balance,
            capital,
            currency,
            children
        }
    }: Props
) {
    const navigationPath = `/accounts/${id}`
    const remaining = capital + balance
    const isChildless = children.length === 0
    const isExternal = [Kind.ExternalExpense, Kind.ExternalIncome].includes(kind)
    const isDebt = [Kind.DebtCredit, Kind.DebtLoan, Kind.DebtPersonal].includes(kind)

    return (
        <details
            className={`divide-y dark:divide-neutral-800 ${!isChildless && "[&_.opener]:open:-rotate-180"}`}
        >
            <summary
                className="grid grid-cols-[minmax(0,_1fr)_min-content] gap-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 items-center"
            >
                <Link
                    to={navigationPath}
                    className={`py-1 ${isChildless ? "px-2 col-span-2" : "pl-2"} ${isDebt ? "grid grid-cols-[minmax(0,_1fr)_min-content] gap-1" : "block"}`}
                >
                    <div className="flex flex-col justify-center min-h-16 leading-snug">
                        <p>{name}</p>
                        <div className="flex justify-between text-sm">
                            <p className={currencyAmountColor(isExternal ? 0 : balance)}>
                                {isExternal ? currency : currencyAmountToHuman(balance, currency)}
                            </p>
                            {
                                kind === Kind.DebtCredit &&
                                <p className={currencyAmountColor(remaining)}>
                                    {currencyAmountToHuman(remaining, currency)}
                                </p>
                            }
                            {
                                kind === Kind.DebtPersonal &&
                                <p className={currencyAmountColor(0)}>personal</p>
                            }
                        </div>
                        <p className={`text-xs ${currencyAmountColor(0)}`}>{description}</p>
                    </div>
                    {isDebt && <Progress progress={Math.abs(remaining / capital)} />}
                </Link>
                {
                    !isChildless && (
                        <div className="px-2 py-1 flex justify-center items-center">
                            <span
                                className="p-1.5 border rounded-full dark:border-neutral-50 border-neutral-950 cursor-pointer"
                            >
                                <svg
                                    className="rotate-0 transform transition-all duration-200 opener"
                                    fill="none"
                                    height={20}
                                    width={20}
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </span>
                        </div>
                    )
                }
            </summary>
            {children.map((child) => (
                <Link
                    to={navigationPath}
                    key={`account:${child.id}`}
                    className="block pl-4 pr-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                    <div className="flex flex-col justify-center min-h-16 leading-snug">
                        <p>{child.name}</p>
                        <p className={`text-sm ${currencyAmountColor(0)}`}>{child.currency}</p>
                        <p className={`text-xs ${currencyAmountColor(0)}`}>{child.description}</p>
                    </div>
                </Link>
            ))}
        </details >
    )
}