import { Goal } from "@/types/Goal";
import { Button } from "@components/ui/button";
import { Card, CardHeader, CardTitle } from "@components/ui/card";

interface Props {
    onSetSavingsGoal: (goal: Goal) => void
    onCreateSavingsGoal: () => void
}

function List({ onCreateSavingsGoal }: Props) {
    return (
        <Card className="overflow-clip">
            <CardHeader
                className="flex flex-row justify-between items-start space-x-0 space-y-0"
            >
                <CardTitle>Savings Goals</CardTitle>
                <Button onClick={() => onCreateSavingsGoal()}>
                    New
                </Button>
            </CardHeader>
            <div>
                Hello There
            </div>
        </Card>
    )
}

export { List };
