import { Link } from "react-router-dom";

import Transaction from "@/types/Transaction";
import Base from "./Base";

interface Props {
    transaction: Transaction
}

export default function WithNavigation({ transaction }: Props) {
    return (<Link className="block px-2 py-1.5" to={`/books/transactions/${transaction.id}`}>
        <Base transaction={transaction} />
    </Link>)
}