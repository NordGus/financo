import { AchievementsTracker } from "@components/widgets/achievements";
import {
    SummaryAvailableCredit,
    SummaryCapital,
    SummaryDebt,
    SummaryNetWorth
} from "@components/widgets/summaries";

export default function Dashboard() {
    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-4xl">
                    Welcome to financo
                </h1>
                <p>Your personal finances helper</p>
            </div>
            <div className="grid grid-cols-12 row-auto gap-4 items-start">
                <SummaryCapital className="self-stretch col-span-3" />
                <SummaryDebt className="self-stretch col-span-3" />
                <SummaryNetWorth className="self-stretch col-span-3" />
                <SummaryAvailableCredit className="self-stretch col-span-3" />
                <AchievementsTracker className="col-span-3 row-span-3" />
            </div>
        </div>
    )
}
