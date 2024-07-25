import Layout, { loader as mainLoader } from "./_index";
import Index, { loader as indexLoader } from "./Index";
import New, { loader as newLoader } from "./New";
import Show, { loader as showLoader } from "./Show";

export default {
    loaders: {
        main: mainLoader,
        accounts: indexLoader,
        new: newLoader,
        account: showLoader
    },
    Index,
    Show,
    New,
    Layout
}