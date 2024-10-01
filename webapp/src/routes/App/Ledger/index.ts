import Layout from "./layout";
import { loader as mainLoader } from "./loader";
import Index, { loader as indexLoader } from "./Index";
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