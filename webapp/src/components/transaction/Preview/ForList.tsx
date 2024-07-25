import Transaction from "@/types/Transaction";
import Base from "./Base";

interface Props {
    transaction: Transaction
}

export default function ForList({ transaction }: Props) {
    return (<div
        className="block px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
        <Base transaction={transaction} />
    </div>)
}