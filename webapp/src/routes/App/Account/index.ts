import Layout, { loader as mainLoader } from "./_index";
import Index, { loader as indexLoader } from "./Index";
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