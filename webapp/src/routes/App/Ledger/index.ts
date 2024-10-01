import Layout from "./layout";
import { loader as mainLoader } from "./loader";
import Index, { loader as indexLoader } from "./Index";
import { action as showAction } from "./Transactions/show";

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