import { Copy } from "~/modules/shared/types/copy";

export const mainAccountManual: Copy = {
  title: "What happens when I mark an Account as my main Account?",
  message: <>
    <p>
      When you mark a Account as your main Account, it makes <span className="font-bold text-foreground">financo</span> base its different features around this Account.
    </p>
    <p>
      Like preselecting it for when you are going to create an new Transaction in your ledger, or when you are defining your budgets costs or recurring payments.
    </p>
    <p>
      If you already have an existing Account mark as your main Account, it will remove it from it and mark the new Account.
    </p>
  </>
}