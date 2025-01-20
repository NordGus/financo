import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/shared/components/ui/card";
import { icons } from "~/shared/components/ui/icon";
import { colorContrast } from "~/shared/helpers/color-contrast";
import { Account } from "../types/preview";
import { ArchivedAccount } from "./badges/archived-account";
import { Balance } from "./badges/balance";
import { MainAccount } from "./badges/main-account";

interface Props {
  account: Account
  onSelectAccount: (account: Account) => void
}

export function PreviewCard({ account, onSelectAccount }: Props) {
  const {
    kind,
    currency,
    name,
    description,
    color,
    capital,
    icon,
    additionalData: {
      main,
      balance,
    },
    deletedAt,
    archivedAt
  } = account

  if (deletedAt) return null

  return (
    <Card onClick={() => onSelectAccount(account)} className="cursor-pointer">
      <CardHeader
        className="min-h-20 p-4"
        style={{
          backgroundColor: color,
          color: colorContrast(color)
        }}
      >
        <CardTitle className="flex flex-row gap-1 items-center [&_svg]:size-5">
          {icons[icon]} {name}
        </CardTitle>
        <CardDescription
          style={{
            color: colorContrast(color),
            opacity: "70%",
          }}
        >
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between gap-2 p-4 items-end">
        {main && <MainAccount />}
        {archivedAt && <ArchivedAccount />}
        <Balance kind={kind} capital={capital} balance={balance} currency={currency} className="flex-grow" />
      </CardContent>
    </Card>
  )
}