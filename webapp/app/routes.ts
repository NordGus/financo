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
    route("morning-brew", "routes/morning-brew/index.tsx"),

    ...prefix("accounts", [
      index("routes/accounts/index.tsx"),
      route(":id", "routes/accounts/show.tsx"), // for actions/loaders only it does not contain a view
    ]),

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

  ...prefix("currencies", [
    route("for-select", "routes/currencies/for-select.tsx") // for actions/loaders only it does not contain a view
  ]),

  layout("modules/authentication/layout.tsx", [
    route("login", "routes/login.tsx"),
  ])
] satisfies RouteConfig;
