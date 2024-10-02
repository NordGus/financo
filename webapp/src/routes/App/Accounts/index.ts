import Index, { loader as indexLoader } from "./Index";
import Layout from "./layout";
import { loader as mainLoader } from "./loader";
import Show, { action as showAction, loader as showLoader } from "./Show";

export default {
    loaders: {
        main: mainLoader,
        accounts: indexLoader,
        account: showLoader
    },
    actions: {
        account: showAction
    },
    Index,
    Show,
    Layout
}