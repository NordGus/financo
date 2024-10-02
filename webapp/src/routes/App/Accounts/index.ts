import Index, { loader as indexLoader } from "./Index";
import Layout from "./layout";
import { loader as mainLoader } from "./loader";
import Show from "./show";
import { action as showAction } from "./show/action";
import { loader as showLoader } from "./show/loader";

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