package requests

import (
	"financo/lib/nullable"
	"time"
)

type Executed struct {
	From nullable.Type[time.Time]
	To   nullable.Type[time.Time]

	// AccountIDs are the ids for the account.Records that are accounts for the
	// user and don't represent income or expense categories. Debt Accounts
	// overlap with categories.
	AccountIDs []int64
	// CategoryIDs are the ids for the account.Records that are income or
	// expense categories for the user and don't represent accounts. Debt
	// Accounts overlap with categories.
	CategoryIDs []int64
}

type ExecutedForAccount struct {
	ID   int64
	From nullable.Type[time.Time]
	To   nullable.Type[time.Time]

	// AccountIDs are the ids for the account.Records that are accounts for the
	// user and don't represent income or expense categories. Debt Accounts
	// overlap with categories.
	AccountIDs []int64
	// CategoryIDs are the ids for the account.Records that are income or
	// expense categories for the user and don't represent accounts. Debt
	// Accounts overlap with categories.
	CategoryIDs []int64
}
