package filters

import (
	"financo/lib/nullable"
	"time"
)

type BalanceForAccount struct {
	ID   int64
	From nullable.Type[time.Time]
	To   nullable.Type[time.Time]
}

func (f *BalanceForAccount) FromValue() time.Time {
	return f.From.OrElse(from())
}

func (f *BalanceForAccount) ToValue() time.Time {
	return f.To.OrElse(to())
}
