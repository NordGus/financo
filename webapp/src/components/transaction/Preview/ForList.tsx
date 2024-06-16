import Transaction from "@/types/Transaction";
import Base from "./Base";

interface Props {
    transaction: Transaction
}

export default function ForList({ transaction }: Props) {
    return (<div
        className="block px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
    >
        <Base transaction={transaction} />
    </div>)
}