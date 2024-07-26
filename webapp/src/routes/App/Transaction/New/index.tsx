import { useOutletContext } from "react-router-dom";

import Panel from "@components/Panel";
import { Throbber } from "@components/Throbber";

interface OutletContext {
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function New() {
    const { setOpenModal } = useOutletContext<OutletContext>()

    return (
        <Panel.Base
            className="h-full"
            header={<>
                {
                    <div
                        className="flex justify-center items-center py-1 px-2 gap-2"
                    >
                        <Throbber variant="small" />
                    </div>
                }
                <Panel.Components.Title text="New Transaction" grow={true} />
                <Panel.Components.ActionButton
                    onClick={() => setOpenModal(false)}
                    text="Close"
                    active={false}
                />
            </>}
        >
            <span className="flex-grow flex justify-center items-center">New Transaction</span>
        </Panel.Base>
    )
}