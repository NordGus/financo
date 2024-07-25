import { createBrowserRouter } from "react-router-dom";

import App from "@routes/App";
import { loader as accountLoader } from "@routes/App/Account/Show";
import Client from "@queries/Client";

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
                element: <App.AccountsAndGoals />,
                children: [
                    {
                        path: ":id",
                        loader: accountLoader(Client),
                        element: <App.Account.Show />
                    },
                    {
                        path: "new/:kind",
                        element: <App.Account.New />
                    },
                    {
                        path: "goals/:id",
                        element: <App.Goal.Show />
                    },
                    {
                        path: "goals/new",
                        element: <App.Goal.New />
                    }
                ]
            },
            {
                path: "books",
                element: <App.Books />,
                children: [
                    {
                        path: "transactions/:id",
                        element: <App.Transaction.Show />
                    },
                    {
                        path: "transactions/new",
                        element: <App.Transaction.New />
                    },
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