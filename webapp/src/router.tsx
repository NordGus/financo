import { createBrowserRouter } from "react-router-dom";

import App from "@routes/App";
import Root from '@routes/app/Root';
import AccountsAndGoals from '@routes/app/AccountsAndGoals';
import Books from '@routes/app/Books';

import Account from "@routes/app/Account";

import ErrorPage from '@routes/ErrorPage';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Root />
            },
            {
                path: "accounts",
                element: <AccountsAndGoals />,
                children: [
                    {
                        path: ":id",
                        element: <Account.Show />
                    },
                    {
                        path: "new",
                        element: <Account.New />
                    }
                ]
            },
            {
                path: "books",
                element: <Books />
            }
        ]
    }
])

export default router