import { Copy } from "~/modules/shared/types/copy";

export const archivedAccountsManual: Copy = {
  title: "What means that an Account is archived?",
  message: <>
    <p>
      When an Account is archived it means you are no longer using it, it can be because you close it, payed it or it was paid. So they simply stop appearing anywhere else inside <span className="font-bold text-foreground">financo</span> like what happens with deletion.
    </p>
    <p>
      But contrary to deletion, you do not lose your Transaction history when you archive any Account, ergo archival only helps to clean the noise within your <span className="font-bold text-foreground">financo</span> experience.
    </p>
  </>
}