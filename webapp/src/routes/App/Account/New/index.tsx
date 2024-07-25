import { useOutletContext, useParams } from "react-router-dom";

import { Kind } from "@/types/Account";

import kindToHuman from "@helpers/account/kindToHuman";
import Panel from "@components/Panel";
import Throbber from "@components/Throbber";

interface OutletContext {
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function New() {
    const { kind } = useParams()
    const { setOpenModal } = useOutletContext<OutletContext>()

    return (
        <Panel.Base
            className="h-full"
            header={<>
                {
                    false && <div
                        className="flex justify-center items-center py-1 px-2 gap-2"
                    >
                        <Throbber variant="small" />
                        <p>Fetching</p>
                    </div>
                }
                <Panel.Components.Title text={`New ${kindToHuman(kind! as Kind)}`} />
                <span className="flex-grow content-['']"></span>
                <Panel.Components.ActionButton
                    active={false}
                    onClick={() => setOpenModal(false)}
                    text="Close" />
            </>}
        >
            <div className="flex-grow grid grid-cols-2 grid-rows-3">
                <div className="row-span-3 overflow-y-auto border-r dark:border-zinc-800">
                    Account Form goes here
                </div>
                <div>
                    a graphic goes here
                </div>
                <div className="row-span-2 border-t dark:border-zinc-800">
                    transactions go here
                </div>
            </div>
        </Panel.Base>
    )
}