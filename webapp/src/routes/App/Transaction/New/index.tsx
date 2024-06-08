import Panel from "@components/Panel";
import Throbber from "@components/Throbber";

export default function New() {
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
                <Panel.Components.ActionLink to="/books" text="Close" />
            </>}
        >
            <span className="flex-grow flex justify-center items-center">New Transaction</span>
        </Panel.Base>
    )
}