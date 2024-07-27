import { QueryClient, useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom"
import { z } from "zod"

import Detailed, { Icon, Kind } from "@/types/Account"
import Client from "@queries/Client"
import { accountQuery } from "@queries/accounts"

import { updateAccount } from "@api/accounts"

import { CardSummary } from "@components/card"
import { TransactionHistory, PendingTransactions, UpcomingTransactions } from "./transactions"
import { AccountBaseDetails } from "./account"
import { Currency } from "dinero.js"
import validateCurrencyCode from "validate-currency-code"
import { isNil } from "lodash"

const formSchema = z.object({
    kind: z.enum(
        [
            Kind.CapitalNormal,
            Kind.CapitalSavings,
            Kind.DebtLoan,
            Kind.DebtPersonal,
            Kind.DebtCredit,
            Kind.ExternalIncome,
            Kind.ExternalExpense
        ],
        {
            required_error: "Kind is required",
            invalid_type_error: "Kind must be a string",
            message: "Kind is not valid"
        }
    ),
    currency: z.custom<Currency>(
        (value) => validateCurrencyCode(value),
        (value) => { return { message: `${value} isn't ISO 4217 currency code` } }
    ),
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string"
    }).trim()
        .min(1, { message: 'Name must be present' })
        .max(60, { message: 'Name must be 60 characters at most' }),
    description: z.nullable(z.string().trim()
        .max(128, { message: "Description must be 128 characters at most" })
    ),
    capital: z.number({
        required_error: "Capital is required",
        invalid_type_error: "Name must be a number"
    }),
    color: z.string({
        required_error: "Color is required",
        invalid_type_error: "Color must be a string"
    }).refine(
        (color) => {
            const validator = new Option().style;
            validator.color = color

            return validator.color.length > 0
        },
        (color) => { return { message: `${color} is not a valid color code` } }
    ),
    archive: z.boolean({
        required_error: "Archive is required",
        invalid_type_error: "Archive must be a boolean"
    }),
    history: z.object({
        present: z.boolean(
            {
                required_error: "Present is required",
                invalid_type_error: "Present must be a boolean"
            }
        ),
        balance: z.nullable(
            z.number({
                required_error: "Balance is required",
                invalid_type_error: "Balance must be a number"
            })
        ),
        at: z.nullable(
            z.string({
                required_error: "At is required",
                invalid_type_error: "At must be a string"
            }).datetime({
                message: "At must be datetime",
                offset: true
            })
        )
    }),
    icon: z.nativeEnum(Icon,
        {
            required_error: "Icon is required",
            invalid_type_error: "Icon is invalid",
            message: "Icon is not supported"
        }
    )
})

export const loader = (queryClient: QueryClient) => async ({ params }: LoaderFunctionArgs) => {
    if (!params.id) {
        throw new Error('No account ID provided')
    }

    await queryClient.ensureQueryData(accountQuery(params.id))

    return { id: params.id, breadcrumb: "Edit Account" }
}

export default function Show() {
    // TODO: Implement a better form component for account details.

    const { id } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>
    const { data: account, isFetching, isError, error } = useSuspenseQuery(accountQuery(id))
    const mutation = useMutation({
        mutationKey: ["account", id],
        mutationFn: (details: Detailed) => updateAccount(details),
        onSuccess: (_data, _variables, _context) => {
            Client.invalidateQueries({ queryKey: ["accounts"] })
            Client.invalidateQueries({ queryKey: ["transactions"] })
        },
        onError: (error, _variable, _context) => { throw error }
    })

    if (isError) throw error

    console.log(formSchema.parse({
        kind: account.kind,
        currency: account.currency,
        name: account.name,
        description: account.description,
        capital: account.capital,
        history: {
            present: false,
            balance: 0,
            at: account.archivedAt
        },
        color: account.color,
        icon: account.icon,
        archive: !isNil(account.archivedAt),
    }))

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
                <AccountBaseDetails isFetching={isFetching} account={account} mutation={mutation} />
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-stretch">
                    <CardSummary
                        key="account:balance"
                        title="Balance"
                        balances={[{ amount: account.balance, currency: account.currency }]}
                        className="grow"
                    />
                    <CardSummary
                        key="account:balance:2"
                        title="Balance"
                        balances={[{ amount: account.balance, currency: account.currency }]}
                        className="grow"
                    />
                </div>
                <UpcomingTransactions accountID={account.id} />
                <PendingTransactions accountID={account.id} />
                <TransactionHistory accountID={account.id} />
            </div>
        </div >
    )
}