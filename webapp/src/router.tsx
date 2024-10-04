import Client from "@queries/Client";
import App from "@routes/app";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App.Layout />,
        errorElement: <App.ErrorBoundary />,
        children: [
            {
                index: true,
                element: <App.Dashboard />
            },
            {
                path: "accounts",
                loader: App.Accounts.loaders.main(Client),
                element: <App.Accounts.Layout />,
                children: [
                    {
                        index: true,
                        loader: App.Accounts.loaders.accounts(Client),
                        element: <App.Accounts.Index />
                    },
                    {
                        path: ":id",
                        loader: App.Accounts.loaders.account(Client),
                        action: App.Accounts.actions.account(Client),
                        element: <App.Accounts.Show />
                    },
                ]
            },
            {
                path: "ledger",
                loader: App.Ledger.loaders.main(Client),
                element: <App.Ledger.Layout />,
                children: [
                    {
                        index: true,
                        loader: App.Ledger.loaders.transactions(Client),
                        element: <App.Ledger.Index />
                    },
                    {
                        path: ":id",
                        action: App.Ledger.actions.transaction(Client),
                    },
                ]
            },
            {
                path: "savings-goals",
                loader: App.SavingsGoals.loaders.main(Client),
                element: <App.SavingsGoals.Layout />,
                children: [
                    {
                        index: true,
                        loader: App.SavingsGoals.loaders.goals(Client),
                        element: <App.SavingsGoals.Index />
                    }
                ]
            },
            {
                path: '*',
                element: <App.NotFound />
            }
        ]
    }
])

export default router