import { Copy } from "~/shared/types/copy";

interface Manual {
  capital: Copy
  savings: Copy
  loans: Copy
  personalDebt: Copy
  credit: Copy
}

export const accountKindsManual: Manual = {
  capital: {
    title: "What is a Capital Account?",
    message: <>
      <p>
        A Capital Account represents your personal bank account, cash wallet, Paypal account, Steam wallet, the bank account you use for your freelance payments, etc.
      </p>
      <p>
        Basically any kind of account where you store capital, but it generates no interest.
      </p>
    </>
  },
  savings: {
    title: "What is a Savings Account",
    message: <>
      <p>
        A Savings Account represents your personal bank savings account, bank deposits, government bonds or any other really simple financial instrument that generates interest in your favour.
      </p>
      <p>
        Basically any kind of capital store that generates interest in your favour.
      </p>
    </>
  },
  loans: {
    title: "What is a Loan Account?",
    message: <>
      <p>
        A Loan Account represents your student loan, car loan, smartphone loan, etc.
      </p>
      <p>
        Basically any kind of simple debt you owe or are owed that generates interest for or against you.
      </p>
    </>
  },
  personalDebt: {
    title: "What is a Personal debt Account?",
    message: <>
      <p>
        A Loan Account represents that lunch your friend payed or you paid for them, that little help you give out to your sibling, etc.
      </p>
      <p>
        Basically any kind of simple debt you owe or are owed that <span className="font-bold">does not</span> generate interest you.
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
        Basically any kind of credit line you owe or are owed that generates interest for or against you and has a set limit and your are somewhat free to tap into for whatever you want to expend it on.
      </p>
    </>
  },
};