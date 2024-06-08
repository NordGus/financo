import Transactions from "./Transactions";
import Chart from "./Chart";

export default function Books() {
    return (
        <div className="grid grid-rows-4 h-full grid-cols-4 gap-1">
            <Transactions.Executed className="col-span-2 row-span-4" />
            <Chart className="col-span-2 row-span-2" />
            <Transactions.Pending className="col-span-2 row-span-2" />
        </div>
    )
}