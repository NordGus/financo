import Panel from "../../components/Panel"
import SummaryCard from "../../components/SummaryCard"

function PanelTitle({ title }: { title: string }) {
    return <h2 className="flex-grow flex items-center px-4">{title}</h2>
}

function AddButton() {
    return (
        <p
            className="
                flex items-center
                px-4
                cursor-pointer
                hover:bg-neutral-100 dark:hover:bg-neutral-800
            "
        >
            Add
        </p>
    )
}

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
            <Panel
                header={
                    <>
                        <PanelTitle title="Goals" />
                        <AddButton />
                    </>
                }
                className="row-span-3"
            ></Panel>
            <Panel
                header={
                    <>
                        <PanelTitle title="Bank Accounts" />
                        <AddButton />
                    </>
                }
            ></Panel>
            <Panel
                header={
                    <>
                        <PanelTitle title="Loans" />
                        <AddButton />
                    </>
                }
            ></Panel>
            <Panel
                header={
                    <>
                        <PanelTitle title="Income" />
                        <AddButton />
                    </>
                }
            ></Panel>
            <Panel
                header={
                    <>
                        <PanelTitle title="Savings" />
                        <AddButton />
                    </>
                }
            ></Panel>
            <Panel
                header={
                    <>
                        <PanelTitle title="Credit Lines" />
                        <AddButton />
                    </>
                }
            ></Panel>
            <Panel
                header={
                    <>
                        <PanelTitle title="Expenses" />
                        <AddButton />
                    </>
                }
            ></Panel>
        </div>
    )
}

export default AccountsAndGoals