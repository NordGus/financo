import { isEmpty, isNil, isNaN } from "lodash"

export default function isEmptyParam(param: unknown): boolean {
    if (typeof param === 'boolean') return false
    if (isEmpty(param)) return true
    if (isNil(param)) return true
    if (isNaN(param)) return true

    return !param
}