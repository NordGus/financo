import { add } from "date-fns"

export function filterTo() {
  return new Date()
}

export function filterFrom() {
  return add(filterTo(), { months: -1 })
}
