import Panel from "../../components/Panel"
import SummaryCard from "../../components/SummaryCard"

function AccountsAndGoals() {
    return (
        <div
            className="
                grid grid-cols-4 grid-rows-[min-content_minmax(0,_1fr)_minmax(0,_1fr)] gap-1
                h-full
            "
        >
            <SummaryCard
                name="Capital"
                summaries={[{ amount: 133742, currency: "EUR" }]}
            />
            <SummaryCard
                name="Debts"
                summaries={[{ amount: -133742, currency: "EUR" }]}
            />
            <SummaryCard
                name="Total"
                summaries={[{ amount: 133742, currency: "EUR" }]}
            />
            <Panel title="Goals" className="row-span-3" />
            <Panel title="Bank Accounts" />
            <Panel title="Loans" />
            <Panel title="Income" />
            <Panel title="Savings" />
            <Panel title="Credit Lines" />
            <Panel title="Expenses" />
        </div>
    )
}

export default AccountsAndGoals