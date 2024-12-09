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
    route("accounts", "routes/accounts/wrapper.tsx", [
      index("routes/accounts/index.tsx"),
      route(":id", "routes/accounts/show.tsx")
    ]),
    ...prefix("ledger", [
      index("routes/ledger/index.tsx")
    ]),
    route("achievements", "routes/achievements/index.tsx")
  ]),
  ...prefix("currencies", [
    route("for-select", "routes/currencies/for-select.tsx")
  ]),
  layout("modules/authentication/layout.tsx", [
    route("login", "routes/login.tsx"),
  ])
] satisfies RouteConfig;
