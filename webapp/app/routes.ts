import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route
} from "@react-router/dev/routes";

export default [
  layout("shared/layout.tsx", [
    index("routes/home.tsx"),
    route("dashboard", "routes/dashboard.tsx"),
    ...prefix("accounts", [
      index("routes/accounts/index.tsx")
    ]),
    ...prefix("ledger", [
      index("routes/ledger/index.tsx")
    ])
  ]),
  layout("modules/authentication/layout.tsx", [
    route("login", "routes/login.tsx"),
  ])
] satisfies RouteConfig;
