package filters

import (
	"financo/lib/nullable"
	"time"
)

type ExecutedTransactionsFilter struct {
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
