import Panel from "@components/Panel";

export default function New() {
    return (
        <Panel.Base
            className="h-full"
            header={
                <>
                    <Panel.Components.Title text="New Goal" grow={true} />
                    <Panel.Components.ActionLink to="/accounts" text="Close" />
                </>
            }
        >
            <div className="flex-grow grid grid-cols-2 grid-rows-3">
                <div className="row-span-3 overflow-y-auto border-r dark:border-zinc-800">
                    Goal Form goes here
                </div>
                <div>
                    a graphic goes here
                </div>
                <div className="row-span-2 border-t dark:border-zinc-800">
                    other goals go here
                </div>
            </div>
        </Panel.Base>
    )
}