import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { isEmpty, isNil } from "lodash";

import Detailed from "@/types/Account";

import {
    monthsTransactionsForAccountQuery,
    monthsUpcomingTransactionsForAccountQuery,
    pendingTransactionsForAccountQuery
} from "@queries/transactions";

import CurrentMonth from "./CurrentMonth";
import Upcoming from "./Upcoming";
import Pending from "./Pending";
import Panel from "@components/Panel";

interface Props {
    account: Detailed,
    className?: string
}

type Tab = "currentMonth" | "upcoming" | "pending"

export default function Transactions({ account, className }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("currentMonth")

    const currentMonth = useQuery(monthsTransactionsForAccountQuery(account.id))
    const upcoming = useQuery(monthsUpcomingTransactionsForAccountQuery(account.id))
    const pending = useQuery(pendingTransactionsForAccountQuery(account.id))

    if (currentMonth.error) throw currentMonth.error
    if (upcoming.error) throw upcoming.error
    if (pending.error) throw pending.error

    return (
        <Panel.WithTabs
            grow={true}
            tabs={[
                {
                    key: "transactions:currentMonth",
                    text: "Current Month",
                    active: activeTab === "currentMonth",
                    onClick: () => setActiveTab("currentMonth")
                },
                {
                    key: "transactions:upcoming",
                    text: "Upcoming",
                    active: activeTab === "upcoming",
                    onClick: () => setActiveTab("upcoming")
                },
                {
                    key: "transactions:pending",
                    text: "Pending",
                    active: activeTab === "pending",
                    onClick: () => setActiveTab("pending")
                },
            ]}
            className={className}
            header={<Panel.Components.Title grow={true} text="Transactions" />}
            loading={currentMonth.isFetching || upcoming.isFetching || pending.isFetching}
            contents={
                {
                    currentMonth: isEmpty(currentMonth.data) || isNil(currentMonth.data)
                        ? null
                        : <CurrentMonth transactions={currentMonth.data} />,
                    upcoming: isEmpty(upcoming.data) || isNil(upcoming.data)
                        ? null
                        : <Upcoming transactions={upcoming.data} />,
                    pending: isEmpty(pending.data) || isNil(pending.data)
                        ? null
                        : <Pending transactions={pending.data} />
                }[activeTab]
            }
            noContentsMessage={
                {
                    currentMonth: <div className="flex flex-col justify-center items-center gap-2">
                        <p>
                            <span className="font-bold">{account.name}</span> doesn't have <span className="font-bold">Transactions</span> for this month
                        </p>
                    </div>,
                    upcoming: <div className="flex flex-col justify-center items-center gap-2">
                        <p>
                            <span className="font-bold">{account.name}</span> doesn't have Upcoming <span className="font-bold">Transactions</span>
                        </p>
                    </div>,
                    pending: <div className="flex flex-col justify-center items-center gap-2">
                        <p>
                            <span className="font-bold">{account.name}</span> doesn't have Pending <span className="font-bold">Transactions</span>
                        </p>
                    </div>
                }[activeTab]
            }
        />
    )
}