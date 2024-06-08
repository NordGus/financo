import Panel from "@components/Panel";

interface ChartProps {
    className: string
}

export default function Chart({ className }: ChartProps) {
    return (
        <Panel.Clean className={className}>
            <span className="flex-grow flex justify-center items-center">
                Expenses and Income Chart
            </span>
        </Panel.Clean>
    )
}