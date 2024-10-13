import Client from "@queries/client";
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
                path: "achievements",
                loader: App.Achievements.loaders.main(Client),
                element: <App.Achievements.Layout />,
                children: [
                    {
                        index: true,
                        loader: App.Achievements.loaders.progress(Client),
                        element: <App.Achievements.Progress />,
                    },
                    {
                        path: "my-journey",
                        loader: App.Achievements.loaders.journey(Client),
                        element: <App.Achievements.MyJourney />
                    },
                    {
                        path: "savings-goals",
                        loader: App.Achievements.actions.savingsGoals.goal(Client)
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