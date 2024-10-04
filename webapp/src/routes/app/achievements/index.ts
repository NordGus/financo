import Layout from "./layout";
import { loader as mainLoader } from "./loader";
import MyJourney from "./my-journey";
import { loader as journeyLoader } from "./my-journey/loader";
import Progress from "./progress";
import { loader as progressLoader } from "./progress/loader";
import { action as savingsGoalsAction } from "./savings-goals/action";

export default {
    loaders: {
        main: mainLoader,
        progress: progressLoader,
        journey: journeyLoader,
    },
    actions: {
        goal: savingsGoalsAction,
    },
    Layout,
    MyJourney,
    Progress,
}