import { SheetHeader, SheetTitle } from "@components/ui/sheet";

interface Props {
    onSetOpenForm: (open: boolean) => void
}

function CreateForm({ onSetOpenForm: __onSetOpenForm }: Props) {
    return (
        <>
            <SheetHeader>
                <SheetTitle>Add Savings Goal</SheetTitle>
            </SheetHeader>
            <div>
                Create Form
            </div>
        </>
    )
}

export { CreateForm };
