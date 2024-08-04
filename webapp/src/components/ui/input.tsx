import * as React from "react"
import CrrcyInput, { CurrencyInputProps } from "react-currency-input-field"

import { cn } from "@/lib/utils"

const baseClassNames = "flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          baseClassNames,
          type === 'color' && "m-0 p-0 [&::-moz-color-swatch]:border-0 [&::-moz-color-swatch]:border-transparent [&::-webkit-color-swatch-wrapper]:border-0 [&::-webkit-color-swatch-wrapper]:border-transparent",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <CrrcyInput
        className={cn(baseClassNames, className)}
        ref={ref}
        {...props}
        decimalScale={2}
        decimalsLimit={2}
        disableAbbreviations={true}
        step={0.01}
        maxLength={15}
      />
    )
  }
)

CurrencyInput.displayName = "CurrencyInput"

export { Input, CurrencyInput }
