import SummaryCard from "../../components/SummaryCard"

type ListCardProps = {
    title: string,
    className?: string
    children?: JSX.Element[]
}

function ListCard({ title, className, children }: ListCardProps) {
    return (
        <div
            className={`
                flex flex-col
                h-full
                bg-neutral-50 dark:bg-neutral-900
                divide-y dark:divide-neutral-800
                border dark:border-neutral-800 rounded-lg
                shadow
                ${className}
            `}
        >
            <div className="h-14 flex justify-between items-stretch">
                <h2 className="text-lg px-4 py-1.5 flex items-center">{title}</h2>
            </div>
            <div className="flex-grow overflow-y-auto divide-y">
                {
                    children
                        ? children
                        : (
                            <div className="h-full flex flex-col justify-center items-center">
                                <span>No children</span>
                            </div>
                        )
                }
            </div>
        </div>
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
            <ListCard title="Goals" className="row-span-3" />
            <ListCard title="Bank Accounts" />
            <ListCard title="Loans" />
            <ListCard title="Income" />
            <ListCard title="Savings" />
            <ListCard title="Credit Lines" />
            <ListCard title="Expenses" />
        </div>
    )
}

export default AccountsAndGoals