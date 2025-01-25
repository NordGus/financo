import moment from "moment";

export function normalizeDateForServer(date: Date): Date {
    return moment(date).utc(true).toDate()
}