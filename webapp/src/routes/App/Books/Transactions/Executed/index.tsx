import Panel from "@components/Panel";
import Filters from "./Filters";
import { useState } from "react";

interface ExecutedProps {
    className: string
}

export default function Executed({ className }: ExecutedProps) {
    const [showFilters, setShowFilters] = useState(false)

    return (
        <Panel.WithFilters
            grow={true}
            className={className}
            header={<>
                <Panel.Components.Title grow={true} text="Transactions" />
                <Panel.Components.ActionButton
                    text={showFilters ? "Hide Filters" : "Show Filters"}
                    onClick={() => setShowFilters(!showFilters)}
                    active={showFilters}
                />
                <Panel.Components.ActionLink
                    text="Add"
                    to="/books/transactions/new"
                />
            </>}
            loading={false}
            contents={<span>Transactions here</span>}
            filters={<Filters />}
            showFilters={showFilters}
        />
    )
}