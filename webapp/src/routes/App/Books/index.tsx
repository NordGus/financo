import { Outlet, useOutlet } from "react-router-dom";
import { useEffect, useState } from "react";

import Transactions from "./Transactions";
import Chart from "./Chart";
import Filters from "./Filters";

import Modal from "@components/Modal";

export default function Books() {
    const outlet = useOutlet()
    const [outletCache, setOutletCache] = useState(outlet)

    useEffect(() => {
        if (outlet && !outletCache) setOutletCache(outlet)
    }, [outlet, outletCache])

    return (
        <>
            <div className="grid grid-rows-4 h-full grid-cols-3 gap-1">
                <Transactions.Filterable className="row-span-4" />
                <Transactions.Pending className="row-span-2" />
                <Filters className="row-span-2" />
                <Chart className="col-span-2 row-span-2" />
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