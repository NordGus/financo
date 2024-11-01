package filters

import (
	"financo/lib/nullable"
	"time"
)

type DailyBalanceForAccount struct {
	ID   int64
	From nullable.Type[time.Time]
	To   nullable.Type[time.Time]
}

func (f *DailyBalanceForAccount) FromValue() time.Time {
	return f.From.OrElse(from())
}

func (f *DailyBalanceForAccount) ToValue() time.Time {
	return f.To.OrElse(to())
}
