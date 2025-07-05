import { Copy } from "~/modules/shared/types/copy";
import { Kind } from "../types/category";

export const categoryKindsManual: Record<Kind, Copy> = {
  expense: {
    title: "What is a Expense Category?",
    message: <>
      <p>
        A Expense Category, is simply a synthetic account that groups expenses of a similar sources. This is to help you categorize your expenses. For finer grain changes you can also define subcategories or children for each Category.
      </p>
      <p>
        For practical reasons any Debt or Credit Account that indicates that you owe money is considered also an Expense Category.
      </p>
    </>
  },
  income: {
    title: "What is a Income Category",
    message: <>
      <p>
        A Expense Category, is simply a synthetic account that groups income of a similar sources. This is to help you categorize your income sources. For finer grain changes you can also define subcategories or children for each Category.
      </p>
      <p>
        For practical reasons any Debt or Credit Account that indicates that you are owed money is considered also an Income Category.
      </p>
    </>
  }
};