import moment from "moment";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import { Screen } from "~/modules/accounts/screens";
import { Account, Kind } from "~/shared/types/account";
import { Currency } from "~/shared/types/currency";
import { Route } from "./+types/index";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "financo - accounts" },
    { name: "description", content: "manage your accounts" }
  ]
}

export async function loader({ }: Route.LoaderArgs) {
  const accounts: Account[] = [
    {
      id: 1,
      kind: "capital_normal" as Kind,
      currency: "EUR" as Currency,
      name: "Personal Bank Account",
      icon: "base",
      color: "#eb8934",
      capital: 0,
      settings: {
        favorite: true,
        balance: 1_337_42,
        transactionCount: 42
      },
      createdAt: moment().add({ days: -30 }).toISOString(),
      updatedAt: moment().add({ days: -30 }).toISOString()
    },
    {
      id: 2,
      kind: "capital_normal" as Kind,
      currency: "USD" as Currency,
      name: "US Bank Account",
      description: "My small business account in the USA",
      icon: "base",
      color: "#eb8934",
      capital: 0,
      settings: {
        favorite: false,
        balance: 1_337_42,
        transactionCount: 24
      },
      createdAt: moment().add({ days: -30 }).toISOString(),
      updatedAt: moment().add({ days: -30 }).toISOString()
    },
    {
      id: 3,
      kind: "debt_loan" as Kind,
      currency: "EUR" as Currency,
      name: "Car Loan",
      description: "My japanese shit box",
      icon: "base",
      color: "#34baeb",
      capital: -5_000_00,
      settings: {
        favorite: false,
        balance: 3_000_00,
        transactionCount: 10
      },
      createdAt: moment().add({ days: -30 }).toISOString(),
      updatedAt: moment().add({ days: -30 }).toISOString()
    },
    {
      id: 4,
      kind: "capital_normal" as Kind,
      currency: "EUR" as Currency,
      name: "Germany Bank Account",
      description: "My small business account in the Germany",
      icon: "base",
      color: "#eb8934",
      capital: 0,
      settings: {
        favorite: false,
        balance: 1_337_42,
        transactionCount: 15
      },
      archivedAt: moment().add({ days: -1 }).toISOString(),
      createdAt: moment().add({ days: -30 }).toISOString(),
      updatedAt: moment().add({ days: -30 }).toISOString()
    },
  ];

  return {
    breadcrumb: "accounts",
    accounts,
  }
}

export default function Index() {
  const { accounts } = useLoaderData<typeof loader>()
  // TODO implement useReducer
  const [formFor, setFromFor] = useState<Kind | null>(null)

  const onNew = (kind: Kind) => setFromFor(kind)

  useEffect(() => console.debug(formFor), [formFor])

  return <Screen accounts={accounts} onNew={onNew} />
}