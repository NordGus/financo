import Layout, { loader as mainLoader } from "./_index";
import Index, { loader as indexLoader } from "./Index";
import { action as showAction } from "./Show";

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