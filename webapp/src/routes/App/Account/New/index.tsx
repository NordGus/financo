import { useParams } from "react-router-dom";

import { Kind } from "@/types/Account";

import kindToHuman from "@helpers/account/kindToHuman";
import Panel from "@components/Panel";
import Throbber from "@components/Throbber";

export default function New() {
    const { kind } = useParams()

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
                <Panel.Components.ActionLink to="/accounts" text="Close" />
            </>}
        >
            <div className="flex-grow grid grid-cols-2 grid-rows-3">
                <div className="row-span-3 overflow-y-auto border-r dark:border-neutral-800">
                    Account Form goes here
                </div>
                <div>
                    a graphic goes here
                </div>
                <div className="row-span-2 border-t dark:border-neutral-800">
                    transactions go here
                </div>
            </div>
        </Panel.Base>
    )
}