type SummaryAmount = {
    amount: number
    currency: string
}

type SummaryCardProps = {
    name: string,
    amounts: SummaryAmount[]
}

function SummaryCard({ name, amounts }: SummaryCardProps) {
    return (
        <div
            className="
                flex items-center justify-between gap-1
                px-4 py-1.5 h-14
                border rounded-lg dark:border-neutral-800
                bg-neutral-50 dark:bg-neutral-900
                shadow
            "
        >
            <p className="flex-grow">{name}</p>
            {amounts.map(({ amount, currency }) => (
                <p
                    className={
                        amount > 0
                            ? "text-green-500"
                            : amount < 0
                                ? "text-red-500"
                                : ""
                    }
                >
                    {amount} {currency}
                </p>
            ))}
        </div>
    )
}

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
                amounts={[{ amount: 133742, currency: "EUR" }]}
            />
            <SummaryCard
                name="Debts"
                amounts={[{ amount: -133742, currency: "EUR" }]}
            />
            <SummaryCard
                name="Total"
                amounts={[{ amount: 133742, currency: "EUR" }]}
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