import Default from "./Default"
import Info from "./Info"

export interface ActionProps {
    onClick: React.MouseEventHandler<HTMLSpanElement>,
    className?: string
}

export default {
    Default,
    Info
}