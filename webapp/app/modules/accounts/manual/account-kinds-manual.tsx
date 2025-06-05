import { Copy } from "~/modules/shared/types/copy";
import { Kind } from "../types/accounts";

export const accountKindsManual: Record<Kind, Copy> = {
  capital: {
    title: "What is a Capital Account?",
    message: <>
      <p>
        A Capital Account represents your personal bank account, cash wallet, Paypal account, Steam wallet, the bank account you use for your freelance payments, etc.
      </p>
      <p>
        Basically any kind of account where you store your capital.
      </p>
    </>
  },
  savings: {
    title: "What is a Savings Account",
    message: <>
      <p>
        A Savings Account represents your personal bank savings account, bank deposits, government bonds or any other financial instrument that generates that represents your savings for the future.
      </p>
      <p>
        Basically any account or asset where you save your capital for the future.
      </p>
    </>
  },
  debt: {
    title: "What is a Debt Account?",
    message: <>
      <p>
        A Debt Account represents your student loan, car loan, smartphone loan, friendly debt, etc.
      </p>
      <p>
        Basically any kind of debt you owe or are owed.
      </p>
    </>
  },
  credit: {
    title: "What is a Credit Account?",
    message: <>
      <p>
        A Credit Account represents your credit cards, credit lines, etc.
      </p>
      <p>
        Basically any kind of credit line you owe or are owed that generates interest for or against you and has a set limit and you are somewhat free to tap into for whatever you want to expend it on.
      </p>
    </>
  },
};