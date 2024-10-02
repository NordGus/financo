import Layout from "./layout";
import Index from "./list";
import { loader as indexLoader } from "./list/loader";
import { loader as mainLoader } from "./loader";
import { action as showAction } from "./transactions/action";

export default {
    loaders: {
        main: mainLoader,
        transactions: indexLoader
    },
    actions: {
        transaction: showAction
    },
    Index,
    Layout,
}