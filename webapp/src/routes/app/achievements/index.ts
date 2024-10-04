import { action as showAction } from "./goal/action";
import Layout from "./layout";
import Index from "./list";
import { loader as indexLoader } from "./list/loader";
import { loader as mainLoader } from "./loader";

export default {
    loaders: {
        main: mainLoader,
        goals: indexLoader
    },
    actions: {
        goal: showAction,
    },
    Index,
    Layout
}