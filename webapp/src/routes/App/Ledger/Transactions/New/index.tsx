import { Dispatch, SetStateAction } from "react";

import Transaction from "@/types/Transaction";

import { deleteTransaction } from "@api/transactions";

import { toast } from "@components/ui/use-toast"

interface Props {
    transaction: {}
    setOpen: Dispatch<SetStateAction<boolean>>
}

export default function NewForm({ transaction }: Props) {
    return (
        <span className="text-zinc-950 dark:text-zinc-50">
            {JSON.stringify(transaction)}
        </span>
    )
}