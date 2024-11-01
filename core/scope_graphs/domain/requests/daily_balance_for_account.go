package requests

import (
	"financo/core/scope_graphs/domain/filters"
	"financo/lib/nullable"
	"time"
)

type DailyBalanceForAccount struct {
	ID   int64
	From nullable.Type[time.Time]
	To   nullable.Type[time.Time]
}

func (r DailyBalanceForAccount) ToFilter() filters.DailyBalanceForAccount {
	return filters.DailyBalanceForAccount{
		ID:   r.ID,
		From: r.From,
		To:   r.To,
	}
}
