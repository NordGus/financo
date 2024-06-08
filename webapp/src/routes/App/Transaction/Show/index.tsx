import Panel from "@components/Panel";
import Throbber from "@components/Throbber";
import { useParams } from "react-router-dom";

export default function Show() {
    const { id } = useParams()

    return (
        <Panel.Base
            className="h-full"
            header={<>
                {
                    <div
                        className="flex justify-center items-center py-1 px-2 gap-2"
                    >
                        <Throbber variant="small" />
                    </div>
                }
                <span className="flex-grow content-['']"></span>
                <Panel.Components.ActionLink to="/books" text="Close" />
            </>}
        >
            <span className="flex-grow flex justify-center items-center">{id}</span>
        </Panel.Base>
    )
}