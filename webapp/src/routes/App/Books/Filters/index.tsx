import Panel from "@components/Panel";

interface FiltersProps {
    className: string
}

export default function Filters({ className }: FiltersProps) {
    return (
        <Panel.Clean className={className}>
            <span className="flex-grow flex justify-center items-center">
                Section Filters
            </span>
        </Panel.Clean>
    )
}