import { Copy } from "~/shared/types/copy";

export const archivedCategoriesManual: Copy = {
  title: "What means that an Category is archived?",
  message: <>
    <p>
      When an Category is archived it means you are no longer using it, it can be because you close it, payed it or it was paid. So they simply stop appearing anywhere else inside <span className="font-bold text-foreground">financo</span> like what happens with deletion.
    </p>
    <p>
      But contrary to deletion, you do not lose your Transaction history when you archive any Category, ergo archival only helps to clean the noise within your <span className="font-bold text-foreground">financo</span> experience.
    </p>
  </>
}