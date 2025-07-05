import { Copy } from "~/modules/shared/types/copy";
import { Kind } from "../types/category";

export const categoryKindsManual: Record<Kind, Copy> = {
  expense: {
    title: "What is a Expense Category?",
    message: <>
      <p>
        A Capital Account represents your personal bank account, cash wallet, Paypal account, Steam wallet, the bank account you use for your freelance payments, etc.
      </p>
      <p>
        Basically any kind of account where you store your capital.
      </p>
    </>
  },
  income: {
    title: "What is a Income Category",
    message: <>
      <p>
        A Savings Account represents your personal bank savings account, bank deposits, government bonds or any other financial instrument that generates that represents your savings for the future.
      </p>
      <p>
        Basically any account or asset where you save your capital for the future.
      </p>
    </>
  }
};