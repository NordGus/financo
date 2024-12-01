import { AsteriskIcon, CheckIcon, DeleteIcon, DiffIcon, DivideIcon, EqualIcon, MinusIcon, PlusIcon } from "lucide-react"
import { ReactNode, useEffect, useMemo, useReducer } from "react"
import { cn } from "~/lib/utils"
import { currencyAmountColor } from "~/shared/helpers/currency-amount-color"
import { currencyAmountToHuman } from "~/shared/helpers/currency-amount-to-human"
import { Currency } from "~/shared/types/currency"
import { Button, buttonVariants } from "../ui/button"
import { DialogClose } from "../ui/dialog"

interface Props {
  initialValue?: number
  currency: Currency
  onChange: (value?: number) => void
}

interface State {
  value: number
  calc: Calc[]
}

interface InitialState {
  initialValue?: number
}

interface ButtonProps {
  type: "dummy" | "button" | "submit" | "clear" | "calc" | "operation"
  name: ReactNode,
  onClick?: () => void,
  disabled: (state: State) => boolean
}

enum CalcOp { Sum, Subtraction, Multiplication, Division }

interface Calc {
  value: number
  op: CalcOp
}

const __actions = {
  MODIFY_VALUE: "MODIFY_VALUE",
  EXECUTE_CALC: "EXECUTE_CALC",
  FLIP_SIGN: "FLIP_SIGN",
  START_CALC: "START_CALC"
} as const

type ActionType = typeof __actions

type Action =
  {
    type: ActionType["MODIFY_VALUE"]
    by: number
  } |
  {
    type: ActionType["EXECUTE_CALC"]
  } | {
    type: ActionType["FLIP_SIGN"]
  } | {
    type: ActionType["START_CALC"]
    op: CalcOp
  }

function runCalcStack(value: number, stack: Calc[]): number {
  let output = value

  for (let idx = 0; idx < stack.length; idx++) {
    const calc = stack[idx];

    if (calc.value === 0) continue
    if (calc.op === CalcOp.Sum) output += calc.value
    if (calc.op === CalcOp.Subtraction) output -= calc.value
    if (calc.op === CalcOp.Multiplication) output = Math.round(output * calc.value)
    if (calc.op === CalcOp.Division) output = Math.round(output / calc.value)
  }

  return output
}

function renderCalcStack(value: number, currency: Currency, stack: Calc[]): ReactNode[] {
  const output: ReactNode[] = [
    <span className={currencyAmountColor(value)} key="render.calc.stack.value">
      {currencyAmountToHuman(value, currency)}
    </span>
  ]

  for (let idx = 0; idx < stack.length; idx++) {
    const calc = stack[idx];
    const key = `render.calc.stack.${idx}`

    if (calc.op === CalcOp.Sum) output.push(
      <PlusIcon key={`${key}.op`} className="h-4 w-4" />,
      <span key={`${key}.value`}>{currencyAmountToHuman(calc.value, currency)}</span>
    )
    if (calc.op === CalcOp.Subtraction) output.push(
      <MinusIcon key={`${key}.op`} className="h-4 w-4" />,
      <span key={`${key}.value`}>{currencyAmountToHuman(calc.value, currency)}</span>
    )
    if (calc.op === CalcOp.Multiplication) output.push(
      <AsteriskIcon key={`${key}.op`} className="h-4 w-4" />,
      <span key={`${key}.value`}>{calc.value}</span>
    )
    if (calc.op === CalcOp.Division) output.push(
      <DivideIcon key={`${key}.op`} className="h-4 w-4" />,
      <span key={`${key}.value`}>{calc.value}</span>
    )
  }

  return output
}

function reducer(state: State, action: Action): State {
  if (action.type === "EXECUTE_CALC") {
    return {
      ...state,
      value: runCalcStack(state.value, state.calc),
      calc: []
    }
  }
  if (action.type === "FLIP_SIGN" && state.calc.length === 0) {
    return {
      ...state,
      value: Math.round(state.value * -1)
    }
  }
  if (action.type === "FLIP_SIGN") {
    return { ...state }
  }
  if (action.type === "MODIFY_VALUE" && state.calc.length === 0) {
    return {
      ...state,
      value: Math.round(state.value * 10) + action.by,
    }
  }
  if (action.type === "MODIFY_VALUE") {
    const calc = [...state.calc]
    const last = calc.splice(calc.length - 1, 1)[0]

    return {
      ...state,
      calc: [
        ...calc,
        {
          ...last,
          value: Math.round(last.value * 10) + action.by
        }
      ]
    }
  }
  if (action.type === "START_CALC") {
    return {
      ...state,
      calc: [...state.calc, { value: 0, op: action.op }]
    }
  }

  throw new Error("unknown action.")
}

function init({ initialValue }: InitialState): State {
  return {
    value: initialValue || 0,
    calc: [],
  }
}

export function Calculator({ initialValue, currency, onChange }: Props) {
  const [state, dispatch] = useReducer(reducer, { initialValue }, init)

  const onModifyValue = (by: number) => dispatch({ type: "MODIFY_VALUE", by })
  const onExecuteCalc = () => dispatch({ type: "EXECUTE_CALC" })
  const onFlipSign = () => dispatch({ type: "FLIP_SIGN" })
  const onStartCalc = (op: CalcOp) => dispatch({ type: "START_CALC", op })

  useEffect(() => { }, [])

  const buttons: ButtonProps[] = useMemo(() => {
    return [
      // line 1
      {
        name: <DivideIcon />,
        type: "calc",
        disabled: (s) => s.calc.length === 0 ? s.value === 0 : s.calc[s.calc.length - 1].value === 0,
        onClick: () => onStartCalc(CalcOp.Division)
      },
      {
        name: "7",
        type: "button",
        disabled: (__s) => false,
        onClick: () => onModifyValue(7)
      },
      {
        name: "8",
        type: "button",
        disabled: (__s) => false,
        onClick: () => onModifyValue(8)
      },
      {
        name: "9",
        type: "button",
        disabled: (__s) => false,
        onClick: () => onModifyValue(9)
      },
      {
        name: <DeleteIcon />,
        type: "clear",
        disabled: (s) => s.calc.length === 0 ? s.value === 0 : s.calc[s.calc.length - 1].value === 0
      },
      // line 2
      {
        name: <AsteriskIcon />,
        type: "calc",
        disabled: (s) => s.calc.length === 0 ? s.value === 0 : s.calc[s.calc.length - 1].value === 0,
        onClick: () => onStartCalc(CalcOp.Multiplication)
      },
      {
        name: "4",
        type: "button",
        disabled: (__s) => false,
        onClick: () => onModifyValue(4)
      },
      {
        name: "5",
        type: "button",
        disabled: (__s) => false,
        onClick: () => onModifyValue(5)
      },
      {
        name: "6",
        type: "button",
        disabled: (__s) => false,
        onClick: () => onModifyValue(6)
      },
      {
        name: <DiffIcon />,
        type: "operation",
        disabled: (s) => s.calc.length !== 0 || s.value === 0,
        onClick: () => onFlipSign()
      },
      // line 3
      {
        name: <MinusIcon />,
        type: "calc",
        disabled: (s) => s.calc.length === 0 ? s.value === 0 : s.calc[s.calc.length - 1].value === 0,
        onClick: () => onStartCalc(CalcOp.Subtraction)
      },
      {
        name: "1",
        type: "button",
        disabled: (__s) => false,
        onClick: () => onModifyValue(1)
      },
      {
        name: "2",
        type: "button",
        disabled: (__s) => false,
        onClick: () => onModifyValue(2)
      },
      {
        name: "3",
        type: "button",
        disabled: (__s) => false,
        onClick: () => onModifyValue(3)
      },
      {
        name: "=",
        type: "submit",
        disabled: (__s) => false
      },
      // line 4
      {
        name: <PlusIcon />,
        type: "calc",
        disabled: (s) => s.calc.length === 0 ? s.value === 0 : s.calc[s.calc.length - 1].value === 0,
        onClick: () => onStartCalc(CalcOp.Sum)
      },
      {
        name: "",
        type: "dummy",
        disabled: (__s) => false
      },
      {
        name: "0",
        type: "button",
        disabled: (__s) => false,
        onClick: () => onModifyValue(0)
      },
    ]
  }, [dispatch])

  return (
    <div className="flex flex-col gap-4 items-stretch justify-center">
      <div
        className={cn(
          "text-3xl mt-4 flex flex-col gap-4 text-right",
          currencyAmountColor(runCalcStack(state.value, state.calc))
        )}
      >
        <div className="flex items-center justify-end gap-2 text-lg text-muted-foreground h-4">
          {state.calc.length > 0 && renderCalcStack(state.value, currency, state.calc)}
        </div>
        <p className="w-full">
          {currencyAmountToHuman(runCalcStack(state.value, state.calc), currency)}
        </p>
      </div>
      <div>
        <div className="grid grid-cols-5 grid-rows-4 gap-2 w-fit m-auto">
          {buttons.map((button, idx) => {
            const key = `${button.type}.${idx}`
            const baseClassNames = "!h-16 w-16 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0"

            switch (button.type) {
              case "dummy":
                return <span key={key}>{""}</span>
              case "operation":
              case "calc":
                return (
                  <Button
                    key={key}
                    className={baseClassNames}
                    variant={"secondary"}
                    disabled={button.disabled(state)}
                    onClick={button.onClick}
                  >
                    {button.name}
                  </Button>
                )
              case "submit":
                return (
                  state.calc.length === 0
                    ? <DialogClose
                      key={key}
                      className={cn(
                        buttonVariants({ className: baseClassNames }),
                        "row-span-2 !h-full"
                      )}
                      onClick={() => onChange(state.value)}
                    >
                      <CheckIcon />
                    </DialogClose>
                    : <Button
                      key={key}
                      className={cn(baseClassNames, "row-span-2 !h-full")}
                      onClick={() => onExecuteCalc()}
                    >
                      <EqualIcon />
                    </Button>
                )
              case "clear":
                return (
                  <Button
                    key={key}
                    className={baseClassNames}
                    variant={"destructive"}
                    disabled={button.disabled(state)}
                  >
                    {button.name}
                  </Button>
                )
              default:
                return (
                  <Button
                    key={key}
                    className={baseClassNames}
                    variant={"outline"}
                    disabled={button.disabled(state)}
                    onClick={button.onClick}
                  >
                    {button.name}
                  </Button>
                )
            }
          })}
        </div>
      </div>
    </div >
  )
}