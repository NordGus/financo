import Panel from "@components/Panel";

interface PendingProps {
    className: string
}

export default function Pending({ className }: PendingProps) {
    return (
        <Panel.WithLoadingIndicator
            className={className}
            header={<Panel.Components.Title grow={true} text="Pending Transactions" />}
            contents={<></>}
        />
    )
}