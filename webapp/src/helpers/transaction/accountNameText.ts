import { Account } from "@/types/Transaction";
import { isNil } from "lodash";

export default function accountNameText(account: Account): string {
    if (isNil(account.parent)) return account.name

    return `${account.parent.name} (${account.name})`
}
