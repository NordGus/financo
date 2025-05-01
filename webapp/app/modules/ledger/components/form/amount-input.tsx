import {
  AsteriskIcon,
  CheckIcon,
  CircleHelpIcon,
  DeleteIcon,
  DiffIcon,
  DivideIcon,
  EqualIcon,
  MinusIcon,
  PlusIcon
} from "lucide-react";
import { ComponentProps, ReactNode, useEffect, useReducer } from "react";
import { cn } from "~/lib/utils";
import { InfoDialog } from "~/modules/shared/components/dialogs/info";
import { calculatorManual } from "~/modules/shared/components/manual/calculator-manual";
import { Button, buttonVariants } from "~/modules/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/modules/shared/components/ui/dialog";
import { currencyAmountColor } from "~/modules/shared/helpers/currency-amount-color";
import { currencyAmountToHuman } from "~/modules/shared/helpers/currency-amount-to-human";
import { Currency } from "~/modules/shared/types/currency";
import { Kind } from "../../types/transactions";

interface Props extends ComponentProps<"div"> {
  value: number
  currency: Currency
  kind: Kind
  onValueChange: (value: number) => void
  dialogTitle?: ReactNode
  dialogDescription?: ReactNode
}


interface State {
  open: boolean
  value: number
  calc: Calc[]
}

interface InitialState {
  initialValue?: number
}

interface ButtonProps {
  type: "dummy" | "button" | "submit" | "clear" | "calc" | "operation" | "help"
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
  REVERT_VALUE: "REVERT_VALUE",
  EXECUTE_CALC: "EXECUTE_CALC",
  FLIP_SIGN: "FLIP_SIGN",
  START_CALC: "START_CALC",
  OPEN_CHANGED: "OPEN_CHANGED",
  VALUE_CHANGED: "VALUE_CHANGED",
} as const

type ActionType = typeof __actions

type Action =
  { type: ActionType["MODIFY_VALUE"], by: number } |
  { type: ActionType["EXECUTE_CALC"] } |
  { type: ActionType["FLIP_SIGN"] } |
  { type: ActionType["START_CALC"], op: CalcOp } |
  { type: ActionType["REVERT_VALUE"] } |
  { type: ActionType["OPEN_CHANGED"], open: boolean } |
  { type: ActionType["VALUE_CHANGED"], value: number }

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

type CallStackProps = {
  value: number
  currency: Currency
  stack: Calc[]
}

function CalcStack({ value, currency, stack }: CallStackProps) {
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

function handleExecuteCalc(state: State, __action: { type: ActionType["EXECUTE_CALC"] }): State {
  return { ...state, value: runCalcStack(state.value, state.calc), calc: [] }
}

function handleFlipSign(state: State, __action: { type: ActionType["FLIP_SIGN"] }): State {
  if (state.calc.length !== 0) return { ...state }
  return { ...state, value: Math.round(state.value * -1) }
}

function handleModifyValue(state: State, action: { type: ActionType["MODIFY_VALUE"], by: number }): State {
  if (state.calc.length === 0) return { ...state, value: Math.round(state.value * 10) + action.by }

  const calc = [...state.calc]
  const last = calc.splice(calc.length - 1, 1)[0]

  return { ...state, calc: [...calc, { ...last, value: Math.round(last.value * 10) + action.by }] }
}

function handleRevertValue(state: State, __action: { type: ActionType["REVERT_VALUE"] }): State {
  if (state.calc.length === 0) {
    const mod = state.value % 10
    const value = (state.value - mod) / 10

    return { ...state, value: Math.round(value) }
  }

  const calc = [...state.calc]
  const { op, value: prev } = calc.splice(calc.length - 1, 1)[0]

  if (prev === 0) return { ...state, calc: [...calc] }

  const mod = prev % 10
  const value = (prev - mod) / 10

  return { ...state, calc: [...calc, { op, value: Math.round(value) }] }
}

function handleStartCalc(state: State, action: { type: ActionType["START_CALC"], op: CalcOp }): State {
  return { ...state, calc: [...state.calc, { value: 0, op: action.op }] }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "EXECUTE_CALC":
      return handleExecuteCalc(state, action)
    case "FLIP_SIGN":
      return handleFlipSign(state, action)
    case "MODIFY_VALUE":
      return handleModifyValue(state, action)
    case "REVERT_VALUE":
      return handleRevertValue(state, action)
    case "START_CALC":
      return handleStartCalc(state, action)
    case "OPEN_CHANGED":
      return { ...state, open: action.open }
    case "VALUE_CHANGED":
      return { ...state, value: action.value }
    default:
      throw new Error("unknown action.")
  }
}

function init({ initialValue }: InitialState): State {
  return {
    value: initialValue || 0,
    open: false,
    calc: [],
  }
}

export function AmountInput({
  value, currency, kind, className, onValueChange, dialogTitle, dialogDescription, ...props
}: Props) {
  const [state, dispatch] = useReducer(reducer, { initialValue: value }, init)

  const onModifyValue = (by: number) => dispatch({ type: "MODIFY_VALUE", by })
  const onExecuteCalc = () => dispatch({ type: "EXECUTE_CALC" })
  const onFlipSign = () => dispatch({ type: "FLIP_SIGN" })
  const onStartCalc = (op: CalcOp) => dispatch({ type: "START_CALC", op })
  const onRevertValue = () => dispatch({ type: "REVERT_VALUE" })

  const onKeyDown = (ev: globalThis.KeyboardEvent) => {
    const disableCalc = state.calc.length === 0 ? state.value === 0 : state.calc[state.calc.length - 1].value === 0

    switch (ev.key.toLocaleLowerCase()) {
      case "0":
        ev.preventDefault()
        return onModifyValue(0)
      case "1":
        ev.preventDefault()
        return onModifyValue(1)
      case "2":
        ev.preventDefault()
        return onModifyValue(2)
      case "3":
        ev.preventDefault()
        return onModifyValue(3)
      case "4":
        ev.preventDefault()
        return onModifyValue(4)
      case "5":
        ev.preventDefault()
        return onModifyValue(5)
      case "6":
        ev.preventDefault()
        return onModifyValue(6)
      case "7":
        ev.preventDefault()
        return onModifyValue(7)
      case "8":
        ev.preventDefault()
        return onModifyValue(8)
      case "9":
        ev.preventDefault()
        return onModifyValue(9)
      case "/":
        ev.preventDefault()
        return !disableCalc && onStartCalc(CalcOp.Division)
      case "*":
        ev.preventDefault()
        return !disableCalc && onStartCalc(CalcOp.Multiplication)
      case "+":
        ev.preventDefault()
        return !disableCalc && onStartCalc(CalcOp.Sum)
      case "-":
        ev.preventDefault()
        return !disableCalc && onStartCalc(CalcOp.Subtraction)
      case "enter":
        ev.preventDefault()
        return onExecuteCalc()
      case "backspace":
        ev.preventDefault()
        return onRevertValue()
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown)

    return () => document.removeEventListener("keydown", onKeyDown)
  }, [dispatch])

  useEffect(() => {
    dispatch({ type: "VALUE_CHANGED", value })
  }, [state.open, value, dispatch])

  const buttons: ButtonProps[] = [
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
      disabled: (__s) => false,
      onClick: () => onRevertValue()
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
      name: "0",
      type: "button",
      disabled: (__s) => false,
      onClick: () => onModifyValue(0)
    },
    {
      name: <CircleHelpIcon />,
      type: "help",
      disabled: (__s) => false,
    },
  ]

  return (
    <Dialog open={state.open} onOpenChange={(open) => dispatch({ type: "OPEN_CHANGED", open })}>
      <DialogTrigger asChild>
        <div
          {...props}
          className={cn(
            "rounded-lg border p-3 flex flex-col gap-4 justify-center items-center cursor-pointer",
            currencyAmountColor(kind === "expense" ? -value : value),
            className
          )}
        >
          <span className="text-2xl font-bold">
            {currencyAmountToHuman(value, currency, { withSign: true })}
          </span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {
            dialogTitle &&
            <DialogTitle>{dialogTitle}</DialogTitle>
          }
          {
            dialogDescription &&
            <DialogDescription>{dialogDescription}</DialogDescription>
          }
        </DialogHeader>
        <div
          className={cn(
            "text-3xl flex flex-col gap-4 text-right border rounded-lg p-2",
            currencyAmountColor(runCalcStack(state.value, state.calc))
          )}
        >
          <span
            className="flex flex-wrap items-center justify-end gap-2 text-lg text-muted-foreground min-h-4 max-h-[30dvh]max-w-[30dvh]"
          >
            {state.calc.length > 0 && <CalcStack value={state.value} currency={currency} stack={state.calc} />}
          </span>
          <p className="w-full">
            {currencyAmountToHuman(runCalcStack(state.value, state.calc), currency)}
          </p>
        </div>
        <div className="grid grid-cols-5 grid-rows-4 gap-1 mx-auto h-auto w-full max-w-[30dvh] *:flex *:items-center *:justify-center *:text-2xl">
          {buttons.map((button, idx) => {
            const key = `${button.type}.${idx}`
            const baseClassNames = "flex [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-6 shrink-0 [&_svg]:shrink-0"

            switch (button.type) {
              case "dummy":
                return <span key={key}>{""}</span>
              case "help":
                return (
                  <InfoDialog
                    key={key}
                    copy={calculatorManual}
                    variant={"ghost"}
                    size={"adaptable"}
                    className={cn(baseClassNames, "aspect-square")}
                  />
                )
              case "operation":
              case "calc":
                return (
                  <Button
                    key={key}
                    className={cn(baseClassNames, "aspect-square")}
                    variant={"secondary"}
                    size={"adaptable"}
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
                        buttonVariants({ className: baseClassNames, size: "adaptable" }),
                        "row-span-2 h-full!"
                      )}
                      onClick={() => onValueChange(state.value)}
                    >
                      <CheckIcon />
                    </DialogClose>
                    : <Button
                      key={key}
                      size={"adaptable"}
                      className={cn(baseClassNames, "row-span-2 h-full!")}
                      onClick={() => onExecuteCalc()}
                    >
                      <EqualIcon />
                    </Button>
                )
              case "clear":
                return (
                  <Button
                    key={key}
                    className={cn(baseClassNames, "aspect-square")}
                    variant={"destructive"}
                    size={"adaptable"}
                    disabled={button.disabled(state)}
                    onClick={button.onClick}
                  >
                    {button.name}
                  </Button>
                )
              default:
                return (
                  <Button
                    key={key}
                    className={cn(
                      baseClassNames,
                      button.name !== "0" && "aspect-square",
                      button.name === "0" && "col-span-2"
                    )}
                    variant={"outline"}
                    size={"adaptable"}
                    disabled={button.disabled(state)}
                    onClick={button.onClick}
                  >
                    {button.name}
                  </Button>
                )
            }
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}