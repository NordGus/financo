import { SavingsGoal } from "@/types/savings-goal";
import Breadcrumbs from "@components/breadcrumbs";
import { NavButton } from "@components/ui/button";
import { Sheet, SheetContent } from "@components/ui/sheet";
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
        goal: SavingsGoal
    }
    | {
        type: LayoutActionType["CREATE_SAVINGS_GOAL"]
    }
    | {
        type: LayoutActionType["OPEN_FORM_CHANGE"],
        open: boolean
    }

type LayoutFormType = "edit-savings-goal" | "new-savings-goal"

interface LayoutState {
    openForm: boolean
    achievement: SavingsGoal | null
    formType: LayoutFormType
    timestamp: string
}

function reducer(state: LayoutState, action: LayoutActions): LayoutState {
    switch (action.type) {
        case "EDIT_SAVINGS_GOAL":
            return {
                ...state,
                achievement: action.goal,
                openForm: true,
                formType: "edit-savings-goal"
            }
        case "CREATE_SAVINGS_GOAL":
            return {
                ...state,
                achievement: null,
                openForm: true,
                formType: "new-savings-goal"
            }
        case "OPEN_FORM_CHANGE":
            return {
                ...state,
                openForm: action.open,
                timestamp: action.open ? state.timestamp : new Date().toISOString()
            }
        default:
            throw Error(`Unknown action`)
    }
}

function init(props: NonNullable<unknown>): LayoutState {
    return {
        ...props,
        openForm: false,
        achievement: null,
        formType: "new-savings-goal",
        timestamp: new Date().toISOString()
    }
}

export interface AchievementsOutletContext {
    onSetSavingsGoal: (goal: SavingsGoal) => void
    onSetOpenForm: (open: boolean) => void
    onCreateSavingsGoal: () => void
    timestamp: string
}

export default function Layout() {
    const [state, dispatch] = useReducer(reducer, {}, init)

    const {
        EDIT_SAVINGS_GOAL, OPEN_FORM_CHANGE, CREATE_SAVINGS_GOAL
    } = actionTypes

    const onSetSavingsGoal = (goal: SavingsGoal) => dispatch({ type: EDIT_SAVINGS_GOAL, goal })
    const onSetOpenForm = (open: boolean) => dispatch({ type: OPEN_FORM_CHANGE, open })
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
                    {
                        {
                            ["new-savings-goal"]: <Goals.CreateForm
                                onSetOpenForm={onSetOpenForm}
                            />,
                            ["edit-savings-goal"]: <Goals.EditForm
                                goal={state.achievement!}
                                onSetOpenForm={onSetOpenForm}
                            />
                        }[state.formType]
                    }
                </SheetContent>
            </Sheet>
            <Outlet
                context={{
                    timestamp: state.timestamp,
                    onSetSavingsGoal,
                    onSetOpenForm,
                    onCreateSavingsGoal
                }}
            />
        </div>
    )
}