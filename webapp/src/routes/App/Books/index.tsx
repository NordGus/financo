import Panel from "@components/Panel";

export default function Books() {
    return (
        <div className="grid grid-rows-4 h-full grid-cols-4 gap-1">
            <Panel.Base
                className="col-span-2 row-span-4"
                header={<>
                    <Panel.Components.Title grow={true} text="Transactions" />
                </>}
            >
                <div className="flex items-center px-2">Filters</div>
                <div className="divide-y dark:divide-neutral-800 flex justify-center items-center flex-grow overflow-y-auto">
                    <span>Transactions here</span>
                </div>
            </Panel.Base>
            <Panel.Clean className="col-span-2 row-span-2">
                <span className="flex-grow flex justify-center items-center">
                    Expenses and Income Chart
                </span>
            </Panel.Clean>
            <Panel.WithLoadingIndicator
                className="col-span-2 row-span-2"
                header={<Panel.Components.Title grow={true} text="Pending Transactions" />}
                contents={<></>}
            />
        </div>
    )
}