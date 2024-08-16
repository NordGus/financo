import { Dispatch } from "react"
import { FiltersAction, FiltersState } from "./_index"

interface Props {
    state: FiltersState
    dispatch: Dispatch<FiltersAction>
}

export function Filters({ }: Props) {
    return (
        <span>Transaction filters</span>
    )
}