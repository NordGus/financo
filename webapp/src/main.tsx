import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import App from "./routes/App";
import Welcome from './routes/app/Welcome';
import AccountsAndGoals from './routes/app/AccountsAndGoals';
import Books from './routes/app/Books';

import ErrorPage from './ErrorPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Welcome />
      },
      {
        path: "accounts",
        element: <AccountsAndGoals />
      },
      {
        path: "books",
        element: <Books />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
