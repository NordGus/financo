import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route
} from "@react-router/dev/routes";

export default [
  layout("modules/shared/layout.tsx", [
    index("routes/morning-brew/index.tsx"),

    route("accounts", "routes/accounts/index.tsx"),
    route("categories", "routes/categories/index.tsx"),

    ...prefix("ledger", [
      index("routes/ledger/index.tsx")
    ]),

    ...prefix("payment-plans", [
      index("routes/payment-plans/index.tsx")
    ]),

    ...prefix("budgets", [
      index("routes/budgets/index.tsx")
    ]),

    ...prefix("settings", [
      index("routes/settings/index.tsx")
    ]),

    route("achievements", "routes/achievements/index.tsx")
  ]),

  layout("modules/authentication/layout.tsx", [
    route("login", "routes/login.tsx"),
  ])
] satisfies RouteConfig;
