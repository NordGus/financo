import { Currency as Code } from "dinero.js"

export interface Currency {
    name: string
    code: Code
}