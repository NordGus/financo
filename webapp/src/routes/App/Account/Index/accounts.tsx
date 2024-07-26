import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";

export function CapitalAccountsTable({ }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle>Capital</CardTitle>
                    <CardDescription>
                        Recent orders from your store.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <h1>capital</h1>
            </CardContent>
        </Card>
    )
}

export function DebtAccountsTable({ }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle>Debts and Credit Lines</CardTitle>
                    <CardDescription>
                        Recent orders from your store.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <h1>debts</h1>
            </CardContent>
        </Card>
    )
}

export function IncomeAccountsTable({ }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle>Income Sources and Incoming Transactions</CardTitle>
                    <CardDescription>
                        Recent orders from your store.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <h1>income</h1>
            </CardContent>
        </Card>
    )
}

export function ExpenseAccountsTable({ }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle>Expenses and Outgoing Transactions</CardTitle>
                    <CardDescription>
                        Recent orders from your store.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <h1>expense</h1>
            </CardContent>
        </Card>
    )
}
