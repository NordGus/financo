import Transaction from "@/types/Transaction";
import Base from "./Base";
import { cn } from "@/lib/utils";

interface Props {
    transaction: Transaction
    onClick?: () => void
    className?: string
}

export default function ForList({ transaction, onClick, className }: Props) {
    return (<div
        className={cn("block px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800", className)}
        onClick={onClick}
    >
        <Base transaction={transaction} />
    </div>)
}