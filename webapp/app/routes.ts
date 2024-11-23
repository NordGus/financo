import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
    layout("authentication/layout.tsx", [
        route("login", "routes/login.tsx"),
    ])
] satisfies RouteConfig;
