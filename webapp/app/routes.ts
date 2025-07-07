import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route
} from "@react-router/dev/routes";

export default [
  layout("modules/shared/layout.tsx", [
    index("routes/home.tsx"),

    route("morning-brew", "routes/morning-brew/index.tsx"),

    layout("routes/accounts/_layout.tsx", [
      route("accounts", "routes/accounts/accounts.tsx", [
        index("routes/accounts/index.tsx"),
        route("new", "routes/accounts/new.tsx"),
        route(":id", "routes/accounts/edit.tsx"),
      ]),
    ]),

    layout("routes/categories/_layout.tsx", [
      route("categories", "routes/categories/categories.tsx", [
        index("routes/categories/index.tsx"),
        route("new", "routes/categories/new.tsx"),
        route(":id", "routes/categories/edit.tsx")
      ]),
    ]),

    layout("routes/ledger/_layout.tsx", [
      route("ledger", "routes/ledger/ledger.tsx", [
        index("routes/ledger/index.tsx"),
        route("new", "routes/ledger/new.tsx"),
        route(":id", "routes/ledger/edit.tsx")
      ])
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
