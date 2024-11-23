import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    layout("authentication/layout.tsx", [
        route("login", "routes/login.tsx"),
    ])
] satisfies RouteConfig;
