import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { isEmpty, isNil } from "lodash"

import { activeAccountsQueries, archivedAccountsQueries } from "@queries/accounts"

import Panel from "@components/Panel"
import WithNavigation from "@components/Account/Preview/WithNavigation"

type Queries = "active" | "archived"

interface Props {
    className?: string
}

export default function Normal({ className }: Props) {
    const activeQuery = useQuery(activeAccountsQueries.capital.normal)
    const archivedQuery = useQuery(archivedAccountsQueries.capital.normal)

    const [currentQuery, setCurrentQuery] = useState<Queries>("active")
    const newAccountPath = "/accounts/new/capital_normal"

    return (
        <Panel.WithLoadingIndicator
            grow={true}
            className={className}
            loading={
                {
                    active: activeQuery.isFetching,
                    archived: archivedQuery.isFetching
                }[currentQuery] || false
            }
            header={
                <>
                    <Panel.Components.Title text="Bank Accounts" grow={true} />
                    <Panel.Components.ActionButton
                        text={<span className="material-symbols-rounded">home_storage</span>}
                        onClick={() => {
                            setCurrentQuery(currentQuery === "active" ? "archived" : "active")
                        }}
                        active={currentQuery === "archived"}
                    />
                    <Panel.Components.ActionLink
                        to={newAccountPath}
                        text={<span className="material-symbols-rounded">add</span>}
                    />
                </>
            }
            contents={
                {
                    active: isEmpty(activeQuery.data) || isNil(activeQuery.data)
                        ? null
                        : activeQuery.data.map((acc) => <WithNavigation
                            key={`account:${acc.id}`}
                            account={acc}
                        />),
                    archived: isEmpty(archivedQuery.data) || isNil(archivedQuery.data)
                        ? null
                        : archivedQuery.data.map((acc) => <WithNavigation
                            key={`account:${acc.id}`}
                            account={acc}
                        />)
                }[currentQuery] || null
            }
            noContentsMessage={
                {
                    active: <div className="flex flex-col justify-center items-center gap-2">
                        <p>No <span className="font-bold">Bank Accounts</span> active in the system</p>
                        <Link to={newAccountPath} className="text-sm underline">
                            Please add a new one
                        </Link>
                    </div>,
                    archived: <div className="flex flex-col justify-center items-center gap-2">
                        <p>No <span className="font-bold">Bank Accounts</span> archived in the system</p>
                    </div>
                }[currentQuery] || undefined
            }
        />
    )
}