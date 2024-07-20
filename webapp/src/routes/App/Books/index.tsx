import { Outlet, useOutlet } from "react-router-dom";
import { useEffect, useState } from "react";

import Transactions from "./Transactions";
import Chart from "./Chart";

import Modal from "@components/Modal";

export default function Books() {
    const outlet = useOutlet()
    const [outletCache, setOutletCache] = useState(outlet)

    useEffect(() => {
        if (outlet && !outletCache) setOutletCache(outlet)
    }, [outlet, outletCache])

    return (
        <>
            <div className="grid grid-rows-[60dvh,_minmax(0,_1fr)] h-full grid-cols-3 gap-1">
                <Transactions.History className="row-span-2" />
                <Transactions.Upcoming className="" />
                <Transactions.Pending className="" />
                <Chart className="col-span-2" />
            </div>
            <Modal
                open={!!outlet}
                onClose={() => setOutletCache(null)} variant="small"
                bodyClassName="h-[75dvh]"
            >
                {
                    outlet
                        ? <Outlet />
                        : (outletCache)
                }
            </Modal>
        </>
    )
}