import { Goal } from "@/types/Goal";
import Breadcrumbs from "@components/breadcrumbs";
import { NavButton } from "@components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@components/ui/sheet";
import { useReducer } from "react";
import { Outlet } from "react-router-dom";
import Goals from "./savings-goals";

const actionTypes = {
    EDIT_SAVINGS_GOAL: "EDIT_SAVINGS_GOAL",
    CREATE_SAVINGS_GOAL: "CREATE_SAVINGS_GOAL",
    OPEN_FORM_CHANGE: "OPEN_FORM_CHANGE"
} as const

type LayoutActionType = typeof actionTypes

type LayoutActions =
    | {
        type: LayoutActionType["EDIT_SAVINGS_GOAL"],
        payload: Goal
    }
    | {
        type: LayoutActionType["CREATE_SAVINGS_GOAL"],
        payload?: null
    }
    | {
        type: LayoutActionType["OPEN_FORM_CHANGE"],
        payload: boolean
    }

type LayoutFormType = "edit-savings-goal" | "new-savings-goal"

interface LayoutState {
    openForm: boolean
    achievement: Goal | NonNullable<unknown>
    formType: LayoutFormType
}

function reducer(state: LayoutState, { type, payload }: LayoutActions): LayoutState {
    switch (type) {
        case "EDIT_SAVINGS_GOAL":
            return {
                ...state,
                achievement: payload,
                openForm: true,
                formType: "edit-savings-goal"
            }
        case "CREATE_SAVINGS_GOAL":
            return {
                ...state,
                achievement: {},
                openForm: true,
                formType: "new-savings-goal"
            }
        case "OPEN_FORM_CHANGE":
            return {
                ...state,
                openForm: payload
            }
        default:
            throw Error(`Unknown action: ${type}`)
    }
}

function init(props: NonNullable<unknown>): LayoutState {
    return {
        ...props,
        openForm: false,
        achievement: {},
        formType: "new-savings-goal"
    }
}

export interface AchievementsOutletContext {
    onSetSavingsGoal: (goal: Goal) => void
    onSetOpenForm: (open: boolean) => void
    onCreateSavingsGoal: () => void
}

export default function Layout() {
    const [state, dispatch] = useReducer(reducer, {}, init)

    const {
        EDIT_SAVINGS_GOAL, OPEN_FORM_CHANGE, CREATE_SAVINGS_GOAL
    } = actionTypes

    const onSetSavingsGoal = (goal: Goal) => dispatch({ type: EDIT_SAVINGS_GOAL, payload: goal })
    const onSetOpenForm = (open: boolean) => dispatch({ type: OPEN_FORM_CHANGE, payload: open })
    const onCreateSavingsGoal = () => dispatch({ type: CREATE_SAVINGS_GOAL })

    return (
        <div className="gap-4 flex flex-col">
            <div className="flex items-center gap-4">
                <Breadcrumbs />
                <span className="grow contents-['']"></span>
                <NavButton to="." end>
                    Progress
                </NavButton>
                <NavButton to="./my-journey" end>
                    My Journey
                </NavButton>
            </div>
            <Sheet open={state.openForm} onOpenChange={onSetOpenForm}>
                <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-[540px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>
                            {
                                {
                                    ["new-savings-goal"]: "Add Savings Goals",
                                    ["edit-savings-goal"]: "Edit Savings Goals"
                                }[state.formType]
                            }
                        </SheetTitle>
                    </SheetHeader>
                    {
                        {
                            ["new-savings-goal"]: <Goals.Form goal={state.achievement} onSetOpenForm={onSetOpenForm} />,
                            ["edit-savings-goal"]: <Goals.Form goal={state.achievement} onSetOpenForm={onSetOpenForm} />
                        }[state.formType]
                    }
                </SheetContent>
            </Sheet>
            <Outlet
                context={{
                    onSetSavingsGoal,
                    onSetOpenForm,
                    onCreateSavingsGoal
                }}
            />
        </div>
    )
}